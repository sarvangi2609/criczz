"""
Chat Service
Business logic for messaging
"""

from datetime import datetime
from typing import Optional
from fastapi import HTTPException, status

from app.models.message import Message, Conversation, ConversationType, MessageType, MessageStatus, Participant
from app.models.user import User
from app.schemas.message import (
    MessageCreate,
    MessageResponse,
    MessageListResponse,
    ConversationCreate,
    ConversationResponse,
    ConversationListResponse,
    ParticipantInfo,
)
from app.schemas.common import SuccessResponse
from app.services.websocket_manager import ws_manager


class ChatService:
    """Chat service class"""
    
    @staticmethod
    def _message_to_response(msg: Message) -> MessageResponse:
        """Convert message model to response"""
        return MessageResponse(
            id=str(msg.id),
            conversation_id=msg.conversation_id,
            sender_id=msg.sender_id,
            sender_name=msg.sender_name,
            sender_photo=msg.sender_photo,
            message_type=msg.message_type,
            content=msg.content,
            image_url=msg.image_url,
            reply_to_message_id=msg.reply_to_message_id,
            status=msg.status,
            created_at=msg.created_at,
            is_deleted=msg.is_deleted,
        )
    
    @staticmethod
    def _conversation_to_response(conv: Conversation) -> ConversationResponse:
        """Convert conversation model to response"""
        return ConversationResponse(
            id=str(conv.id),
            conversation_type=conv.conversation_type,
            participants=[
                ParticipantInfo(
                    user_id=p.user_id,
                    user_name=p.user_name,
                    user_photo=p.user_photo,
                    is_admin=p.is_admin,
                )
                for p in conv.participants
            ],
            title=conv.title,
            match_request_id=conv.match_request_id,
            last_message=conv.last_message,
            last_message_at=conv.last_message_at,
            last_message_by=conv.last_message_by,
            message_count=conv.message_count,
            is_active=conv.is_active,
            created_at=conv.created_at,
        )
    
    @staticmethod
    async def get_user_conversations(user_id: str) -> ConversationListResponse:
        """Get all conversations for a user"""
        conversations = await Conversation.find(
            Conversation.participant_ids.in_([user_id]),
            Conversation.is_active == True,
        ).sort(-Conversation.last_message_at).to_list()
        
        return ConversationListResponse(
            conversations=[
                ChatService._conversation_to_response(c) 
                for c in conversations
            ],
            total=len(conversations),
        )
    
    @staticmethod
    async def create_conversation(
        user_id: str,
        request: ConversationCreate
    ) -> ConversationResponse:
        """Create a new conversation"""
        # Get user info
        creator = await User.get(user_id)
        
        if not creator:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check for existing direct conversation
        if request.conversation_type == "direct" and len(request.participant_ids) == 1:
            other_user_id = request.participant_ids[0]
            
            existing = await Conversation.find_one(
                Conversation.conversation_type == ConversationType.DIRECT,
                Conversation.participant_ids.all([user_id, other_user_id]),
            )
            
            if existing:
                return ChatService._conversation_to_response(existing)
        
        # Build participants list
        all_participant_ids = list(set([user_id] + request.participant_ids))
        participants = []
        
        for pid in all_participant_ids:
            user = await User.get(pid)
            if user:
                participants.append(Participant(
                    user_id=str(user.id),
                    user_name=user.name,
                    user_photo=user.profile_photo,
                    is_admin=pid == user_id,  # Creator is admin
                ))
        
        # Create conversation
        conversation = Conversation(
            conversation_type=ConversationType(request.conversation_type),
            participants=participants,
            participant_ids=all_participant_ids,
            title=request.title,
            match_request_id=request.match_request_id,
        )
        
        await conversation.insert()
        
        # Add users to WebSocket subscription
        for pid in all_participant_ids:
            ws_manager.add_to_conversation(str(conversation.id), pid)
        
        return ChatService._conversation_to_response(conversation)
    
    @staticmethod
    async def get_conversation(
        conversation_id: str,
        user_id: str
    ) -> ConversationResponse:
        """Get conversation details"""
        conversation = await Conversation.get(conversation_id)
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        if user_id not in conversation.participant_ids:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        return ChatService._conversation_to_response(conversation)
    
    @staticmethod
    async def get_messages(
        conversation_id: str,
        user_id: str,
        before: Optional[str] = None,
        limit: int = 50,
    ) -> MessageListResponse:
        """Get messages from a conversation"""
        conversation = await Conversation.get(conversation_id)
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        if user_id not in conversation.participant_ids:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        query = Message.find(
            Message.conversation_id == conversation_id,
            Message.is_deleted == False,
        )
        
        # Pagination using cursor
        if before:
            before_msg = await Message.get(before)
            if before_msg:
                query = query.find(Message.created_at < before_msg.created_at)
        
        messages = await query.sort(-Message.created_at).limit(limit).to_list()
        
        # Reverse to get chronological order
        messages.reverse()
        
        total = await Message.find(
            Message.conversation_id == conversation_id,
            Message.is_deleted == False,
        ).count()
        
        return MessageListResponse(
            messages=[ChatService._message_to_response(m) for m in messages],
            total=total,
            has_more=len(messages) == limit,
        )
    
    @staticmethod
    async def send_message(
        conversation_id: str,
        user_id: str,
        request: MessageCreate
    ) -> MessageResponse:
        """Send a message in a conversation"""
        conversation = await Conversation.get(conversation_id)
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        if user_id not in conversation.participant_ids:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        user = await User.get(user_id)
        
        # Create message
        message = Message(
            conversation_id=conversation_id,
            sender_id=user_id,
            sender_name=user.name,
            sender_photo=user.profile_photo,
            message_type=MessageType(request.message_type),
            content=request.content,
            reply_to_message_id=request.reply_to_message_id,
            status=MessageStatus.SENT,
        )
        
        await message.insert()
        
        # Update conversation
        conversation.last_message = request.content[:100]
        conversation.last_message_at = datetime.utcnow()
        conversation.last_message_by = user_id
        conversation.message_count += 1
        conversation.updated_at = datetime.utcnow()
        await conversation.save()
        
        return ChatService._message_to_response(message)
    
    @staticmethod
    async def mark_as_read(
        conversation_id: str,
        user_id: str
    ) -> SuccessResponse:
        """Mark all messages as read"""
        conversation = await Conversation.get(conversation_id)
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        
        if user_id not in conversation.participant_ids:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Update all unread messages
        messages = await Message.find(
            Message.conversation_id == conversation_id,
            Message.sender_id != user_id,
        ).to_list()
        
        for msg in messages:
            if user_id not in msg.read_by:
                msg.read_by.append(user_id)
                msg.status = MessageStatus.READ
                await msg.save()
        
        # Update participant's last_read
        for participant in conversation.participants:
            if participant.user_id == user_id:
                if messages:
                    participant.last_read_message_id = str(messages[-1].id)
        
        await conversation.save()
        
        return SuccessResponse(message="Messages marked as read")
    
    @staticmethod
    async def delete_message(
        message_id: str,
        user_id: str
    ) -> SuccessResponse:
        """Soft delete a message"""
        message = await Message.get(message_id)
        
        if not message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found"
            )
        
        if message.sender_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own messages"
            )
        
        message.is_deleted = True
        message.deleted_at = datetime.utcnow()
        message.content = "This message was deleted"
        await message.save()
        
        return SuccessResponse(message="Message deleted")
