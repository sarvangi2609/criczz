"""
User Schemas
Request/Response models for user endpoints
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


class UserProfileUpdate(BaseModel):
    """User profile update request"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, min_length=10, max_length=15)
    profile_photo: Optional[str] = None
    skill_level: Optional[str] = None
    area: Optional[str] = None
    preferred_time: Optional[str] = None


class UserProfileResponse(BaseModel):
    """Complete user profile response"""
    id: str
    name: str
    email: str
    phone: str
    profile_photo: Optional[str] = None
    role: str
    skill_level: Optional[str] = None
    area: Optional[str] = None
    preferred_time: Optional[str] = None
    total_matches_played: int
    rating: float
    is_verified: bool
    created_at: datetime


class UserPublicProfile(BaseModel):
    """Public user profile (visible to other users)"""
    id: str
    name: str
    profile_photo: Optional[str] = None
    skill_level: Optional[str] = None
    area: Optional[str] = None
    total_matches_played: int
    rating: float


class UserListResponse(BaseModel):
    """List of users response"""
    users: List[UserPublicProfile]
    total: int
    page: int
    limit: int
