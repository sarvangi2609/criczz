"""
Match Request Model
Stores player matching/team finding requests
"""

from datetime import datetime, date
from typing import Optional, List
from beanie import Document
from pydantic import Field, BaseModel
from enum import Enum


class RequestStatus(str, Enum):
    """Match request status"""
    OPEN = "open"        # Accepting players
    CLOSED = "closed"    # Team complete
    CANCELLED = "cancelled"
    EXPIRED = "expired"  # Date passed


class JoinRequestStatus(str, Enum):
    """Status of player's join request"""
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class JoinRequest(BaseModel):
    """
    Embedded document for players who want to join
    """
    user_id: str
    user_name: str
    user_phone: Optional[str] = None
    user_photo: Optional[str] = None
    skill_level: Optional[str] = None
    message: Optional[str] = None
    status: JoinRequestStatus = JoinRequestStatus.PENDING
    requested_at: datetime = Field(default_factory=datetime.utcnow)
    responded_at: Optional[datetime] = None


class MatchRequest(Document):
    """
    Match Request document model for MongoDB
    
    Stores player matching requests - "Looking for players" type posts
    """
    
    # Creator Information
    creator_id: str = Field(...)
    creator_name: str = Field(...)
    creator_phone: Optional[str] = None
    creator_photo: Optional[str] = None
    creator_skill_level: Optional[str] = None
    
    # Request Details
    title: str = Field(..., min_length=5, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    
    # Match Details
    match_date: date = Field(...)
    preferred_time: str = Field(...)  # "Evening", "Morning", or specific time
    start_time: Optional[str] = None  # "18:00"
    end_time: Optional[str] = None    # "20:00"
    
    # Location
    preferred_area: str = Field(...)  # Vesu, Adajan, etc.
    cricket_box_id: Optional[str] = None  # If already selected a box
    cricket_box_name: Optional[str] = None
    
    # Players
    players_needed: int = Field(..., ge=1, le=11)
    players_joined: int = Field(default=0)
    skill_level_required: Optional[str] = None  # Beginner, Intermediate, Advanced
    
    # Join Requests
    join_requests: List[JoinRequest] = Field(default=[])
    accepted_players: List[str] = Field(default=[])  # User IDs of accepted players
    
    # Status
    status: RequestStatus = Field(default=RequestStatus.OPEN)
    
    # Chat Room (created after players are accepted)
    chat_room_id: Optional[str] = None
    
    # Booking (after final booking is made)
    booking_id: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    
    class Settings:
        name = "match_requests"
        
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Need 4 players for evening match",
                "match_date": "2024-01-26",
                "preferred_time": "Evening",
                "preferred_area": "Vesu",
                "players_needed": 4,
                "skill_level_required": "intermediate",
            }
        }
