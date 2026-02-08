"""
Chat/Message Schemas
Request/Response models for chat endpoints
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class MessageCreate(BaseModel):
    """Create new message"""
    content: str = Field(..., min_length=1, max_length=2000)
    message_type: str = "text"
    reply_to_message_id: Optional[str] = None


class MessageResponse(BaseModel):
    """Message response"""
    id: str
    conversation_id: str
    sender_id: str
    sender_name: str
    sender_photo: Optional[str] = None
    message_type: str
    content: str
    image_url: Optional[str] = None
    reply_to_message_id: Optional[str] = None
    status: str
    created_at: datetime
    is_deleted: bool = False


class ConversationCreate(BaseModel):
    """Create new conversation"""
    participant_ids: List[str]
    conversation_type: str = "direct"
    title: Optional[str] = None
    match_request_id: Optional[str] = None


class ParticipantInfo(BaseModel):
    """Participant information"""
    user_id: str
    user_name: str
    user_photo: Optional[str] = None
    is_admin: bool = False


class ConversationResponse(BaseModel):
    """Conversation response"""
    id: str
    conversation_type: str
    participants: List[ParticipantInfo]
    title: Optional[str] = None
    match_request_id: Optional[str] = None
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    last_message_by: Optional[str] = None
    message_count: int
    is_active: bool
    created_at: datetime


class ConversationListResponse(BaseModel):
    """List of conversations"""
    conversations: List[ConversationResponse]
    total: int


class MessageListResponse(BaseModel):
    """List of messages"""
    messages: List[MessageResponse]
    total: int
    has_more: bool


# WebSocket Event Schemas
class WSMessageEvent(BaseModel):
    """WebSocket message event"""
    event: str  # "new_message", "typing", "read"
    conversation_id: str
    data: dict


class TypingEvent(BaseModel):
    """Typing indicator event"""
    conversation_id: str
    user_id: str
    user_name: str
    is_typing: bool
