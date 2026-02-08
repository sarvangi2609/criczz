"""
Message and Conversation Models
Stores chat messages between players
"""

from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field, BaseModel
from enum import Enum


class MessageType(str, Enum):
    """Type of message"""
    TEXT = "text"
    IMAGE = "image"
    SYSTEM = "system"  # System notifications like "Player X joined"


class MessageStatus(str, Enum):
    """Message delivery status"""
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"


class ConversationType(str, Enum):
    """Type of conversation"""
    DIRECT = "direct"  # One-to-one
    GROUP = "group"    # Match request group chat


class Participant(BaseModel):
    """
    Participant in a conversation
    """
    user_id: str
    user_name: str
    user_photo: Optional[str] = None
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    last_read_message_id: Optional[str] = None
    is_admin: bool = False  # For group chats


class Conversation(Document):
    """
    Conversation document model for MongoDB
    
    Represents a chat thread (direct or group)
    """
    
    # Conversation Type
    conversation_type: ConversationType = Field(...)
    
    # Participants
    participants: List[Participant] = Field(default=[])
    participant_ids: List[str] = Field(default=[])  # For quick lookup
    
    # Group Chat Details (for match requests)
    title: Optional[str] = None  # Group name
    match_request_id: Optional[str] = None
    
    # Last Message Preview
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    last_message_by: Optional[str] = None
    
    # Stats
    message_count: int = Field(default=0)
    
    # Status
    is_active: bool = Field(default=True)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "conversations"


class Message(Document):
    """
    Message document model for MongoDB
    
    Individual chat message
    """
    
    # References
    conversation_id: str = Field(...)
    sender_id: str = Field(...)
    sender_name: str = Field(...)
    sender_photo: Optional[str] = None
    
    # Content
    message_type: MessageType = Field(default=MessageType.TEXT)
    content: str = Field(..., min_length=1, max_length=2000)
    image_url: Optional[str] = None  # For image messages
    
    # Reply
    reply_to_message_id: Optional[str] = None
    
    # Status
    status: MessageStatus = Field(default=MessageStatus.SENT)
    
    # Read by (for group chats)
    read_by: List[str] = Field(default=[])  # User IDs
    delivered_to: List[str] = Field(default=[])
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    edited_at: Optional[datetime] = None
    
    # Soft delete
    is_deleted: bool = Field(default=False)
    deleted_at: Optional[datetime] = None
    
    class Settings:
        name = "messages"
        
    class Config:
        json_schema_extra = {
            "example": {
                "content": "Hey, are we still on for tomorrow?",
                "message_type": "text",
                "status": "sent",
            }
        }
