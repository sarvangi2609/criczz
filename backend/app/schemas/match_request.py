"""
Match Request Schemas
Request/Response models for player matching endpoints
"""

from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field


class MatchRequestCreate(BaseModel):
    """Create match request"""
    title: str = Field(..., min_length=5, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    match_date: date
    preferred_time: str  # "Morning", "Evening", or "18:00-20:00"
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    preferred_area: str
    cricket_box_id: Optional[str] = None
    players_needed: int = Field(..., ge=1, le=11)
    skill_level_required: Optional[str] = None


class MatchRequestUpdate(BaseModel):
    """Update match request"""
    title: Optional[str] = None
    description: Optional[str] = None
    match_date: Optional[date] = None
    preferred_time: Optional[str] = None
    players_needed: Optional[int] = None
    skill_level_required: Optional[str] = None
    status: Optional[str] = None


class JoinRequestCreate(BaseModel):
    """Request to join a match"""
    message: Optional[str] = Field(None, max_length=200)


class JoinRequestResponse(BaseModel):
    """Join request response"""
    user_id: str
    user_name: str
    user_photo: Optional[str] = None
    skill_level: Optional[str] = None
    message: Optional[str] = None
    status: str
    requested_at: datetime


class MatchRequestResponse(BaseModel):
    """Match request response"""
    id: str
    creator_id: str
    creator_name: str
    creator_photo: Optional[str] = None
    creator_skill_level: Optional[str] = None
    title: str
    description: Optional[str] = None
    match_date: date
    preferred_time: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    preferred_area: str
    cricket_box_id: Optional[str] = None
    cricket_box_name: Optional[str] = None
    players_needed: int
    players_joined: int
    skill_level_required: Optional[str] = None
    status: str
    join_requests: List[JoinRequestResponse] = []
    accepted_players: List[str] = []
    chat_room_id: Optional[str] = None
    created_at: datetime


class MatchRequestListResponse(BaseModel):
    """List of match requests"""
    requests: List[MatchRequestResponse]
    total: int
    page: int
    limit: int


class MatchRequestFilter(BaseModel):
    """Match request filter"""
    area: Optional[str] = None
    date: Optional[date] = None
    skill_level: Optional[str] = None
    status: Optional[str] = None
