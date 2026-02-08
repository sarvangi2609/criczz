"""
Chat Endpoints
Messaging between players
"""

from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect, status
from typing import Optional

from app.schemas.message import (
    MessageCreate,
    MessageResponse,
    MessageListResponse,
    ConversationCreate,
    ConversationResponse,
    ConversationListResponse,
)
from app.schemas.common import SuccessResponse
from app.services.chat_service import ChatService
from app.services.websocket_manager import ws_manager
from app.api.deps import get_current_user, get_current_user_ws

router = APIRouter()


# Conversation Endpoints

@router.get(
    "/conversations",
    response_model=ConversationListResponse,
    summary="Get my conversations"
)
async def get_my_conversations(
    current_user = Depends(get_current_user)
):
    """
    Get all conversations for current user.
    """
    return await ChatService.get_user_conversations(str(current_user.id))


@router.post(
    "/conversations",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create conversation"
)
async def create_conversation(
    request: ConversationCreate,
    current_user = Depends(get_current_user)
):
    """
    Create a new conversation (direct or group).
    """
    return await ChatService.create_conversation(
        str(current_user.id),
        request
    )


@router.get(
    "/conversations/{conversation_id}",
    response_model=ConversationResponse,
    summary="Get conversation details"
)
async def get_conversation(
    conversation_id: str,
    current_user = Depends(get_current_user)
):
    """
    Get conversation details.
    """
    return await ChatService.get_conversation(
        conversation_id,
        str(current_user.id)
    )


# Message Endpoints

@router.get(
    "/conversations/{conversation_id}/messages",
    response_model=MessageListResponse,
    summary="Get messages"
)
async def get_messages(
    conversation_id: str,
    before: Optional[str] = None,  # Message ID for pagination
    limit: int = 50,
    current_user = Depends(get_current_user)
):
    """
    Get messages from a conversation.
    """
    return await ChatService.get_messages(
        conversation_id,
        str(current_user.id),
        before=before,
        limit=limit
    )


@router.post(
    "/conversations/{conversation_id}/messages",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Send message"
)
async def send_message(
    conversation_id: str,
    request: MessageCreate,
    current_user = Depends(get_current_user)
):
    """
    Send a message in a conversation.
    
    Also broadcasts to WebSocket for real-time delivery.
    """
    message = await ChatService.send_message(
        conversation_id,
        str(current_user.id),
        request
    )
    
    # Broadcast to WebSocket
    await ws_manager.broadcast_to_conversation(
        conversation_id,
        {
            "event": "new_message",
            "data": message.dict()
        }
    )
    
    return message


@router.post(
    "/conversations/{conversation_id}/read",
    response_model=SuccessResponse,
    summary="Mark messages as read"
)
async def mark_messages_read(
    conversation_id: str,
    current_user = Depends(get_current_user)
):
    """
    Mark all messages in conversation as read.
    """
    return await ChatService.mark_as_read(
        conversation_id,
        str(current_user.id)
    )


@router.delete(
    "/messages/{message_id}",
    response_model=SuccessResponse,
    summary="Delete message"
)
async def delete_message(
    message_id: str,
    current_user = Depends(get_current_user)
):
    """
    Delete (soft delete) a message.
    """
    return await ChatService.delete_message(
        message_id,
        str(current_user.id)
    )


# WebSocket Endpoint

@router.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    """
    WebSocket endpoint for real-time messaging.
    
    - Connect with JWT token
    - Receive real-time messages
    - Send typing indicators
    """
    user = await get_current_user_ws(token)
    
    if not user:
        await websocket.close(code=4001)
        return
    
    user_id = str(user.id)
    
    await ws_manager.connect(websocket, user_id)
    
    try:
        while True:
            data = await websocket.receive_json()
            
            # Handle different event types
            if data.get("event") == "typing":
                # Broadcast typing indicator
                await ws_manager.broadcast_to_conversation(
                    data.get("conversation_id"),
                    {
                        "event": "typing",
                        "user_id": user_id,
                        "user_name": user.name,
                        "is_typing": data.get("is_typing", False)
                    },
                    exclude_user=user_id
                )
            
            elif data.get("event") == "read":
                # Mark as read and notify
                await ChatService.mark_as_read(
                    data.get("conversation_id"),
                    user_id
                )
                
    except WebSocketDisconnect:
        ws_manager.disconnect(user_id)
