"""
User Model
Stores player, owner, and admin information
"""

from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field, EmailStr
from enum import Enum


class UserRole(str, Enum):
    """User role types"""
    PLAYER = "player"
    OWNER = "owner"
    ADMIN = "admin"


class SkillLevel(str, Enum):
    """Cricket skill levels"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    PROFESSIONAL = "professional"


class User(Document):
    """
    User document model for MongoDB
    
    Stores all user types: Player, Box Owner, Admin
    """
    
    # Basic Information
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr = Field(..., unique=True)
    phone: str = Field(..., min_length=10, max_length=15)
    password_hash: str = Field(...)
    
    # Profile
    profile_photo: Optional[str] = None  # S3 URL
    role: UserRole = Field(default=UserRole.PLAYER)
    
    # Player Specific
    skill_level: Optional[SkillLevel] = None
    area: Optional[str] = None  # Vesu, Adajan, etc.
    preferred_time: Optional[str] = None  # Morning, Evening, etc.
    
    # Stats
    total_matches_played: int = Field(default=0)
    rating: float = Field(default=0.0)
    total_ratings: int = Field(default=0)
    
    # Account Status
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    is_phone_verified: bool = Field(default=False)
    is_email_verified: bool = Field(default=False)
    
    # OTP
    otp_code: Optional[str] = None
    otp_expiry: Optional[datetime] = None
    
    # Refresh Token
    refresh_token: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    class Settings:
        name = "users"
        
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Raj Patel",
                "email": "raj@example.com",
                "phone": "9876543210",
                "role": "player",
                "skill_level": "intermediate",
                "area": "Vesu",
            }
        }
