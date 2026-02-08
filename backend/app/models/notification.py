"""
Notification Model
Stores user notifications
"""

from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field
from enum import Enum


class NotificationType(str, Enum):
    """Types of notifications"""
    BOOKING_CONFIRMED = "booking_confirmed"
    BOOKING_CANCELLED = "booking_cancelled"
    BOOKING_REMINDER = "booking_reminder"
    PAYMENT_SUCCESS = "payment_success"
    PAYMENT_FAILED = "payment_failed"
    MATCH_REQUEST_NEW = "match_request_new"
    MATCH_REQUEST_JOIN = "match_request_join"
    MATCH_REQUEST_ACCEPTED = "match_request_accepted"
    MATCH_REQUEST_REJECTED = "match_request_rejected"
    NEW_MESSAGE = "new_message"
    NEW_REVIEW = "new_review"
    SYSTEM = "system"


class Notification(Document):
    """
    Notification document model for MongoDB
    """
    
    # Recipient
    user_id: str = Field(...)
    
    # Notification Content
    notification_type: NotificationType = Field(...)
    title: str = Field(...)
    message: str = Field(...)
    
    # Related Entity
    related_id: Optional[str] = None  # Booking ID, Match Request ID, etc.
    related_type: Optional[str] = None  # "booking", "match_request", etc.
    
    # Action URL
    action_url: Optional[str] = None  # Deep link to relevant page
    
    # Status
    is_read: bool = Field(default=False)
    read_at: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "notifications"
