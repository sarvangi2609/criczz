"""
Review Schemas
Request/Response models for review endpoints
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    """Create review request"""
    cricket_box_id: str
    booking_id: Optional[str] = None
    rating: float = Field(..., ge=1, le=5)
    title: Optional[str] = Field(None, max_length=100)
    review_text: Optional[str] = Field(None, max_length=1000)
    cleanliness_rating: Optional[float] = Field(None, ge=1, le=5)
    facilities_rating: Optional[float] = Field(None, ge=1, le=5)
    value_for_money_rating: Optional[float] = Field(None, ge=1, le=5)
    staff_behavior_rating: Optional[float] = Field(None, ge=1, le=5)
    photos: List[str] = []


class ReviewUpdate(BaseModel):
    """Update review request"""
    rating: Optional[float] = Field(None, ge=1, le=5)
    title: Optional[str] = None
    review_text: Optional[str] = None


class ReviewResponse(BaseModel):
    """Review response"""
    id: str
    user_id: str
    user_name: str
    user_photo: Optional[str] = None
    cricket_box_id: str
    cricket_box_name: Optional[str] = None
    rating: float
    title: Optional[str] = None
    review_text: Optional[str] = None
    cleanliness_rating: Optional[float] = None
    facilities_rating: Optional[float] = None
    value_for_money_rating: Optional[float] = None
    staff_behavior_rating: Optional[float] = None
    photos: List[str] = []
    owner_response: Optional[str] = None
    owner_responded_at: Optional[datetime] = None
    is_verified: bool
    helpful_count: int
    created_at: datetime


class ReviewListResponse(BaseModel):
    """List of reviews"""
    reviews: List[ReviewResponse]
    total: int
    average_rating: float
    page: int
    limit: int


class OwnerResponseCreate(BaseModel):
    """Owner response to review"""
    response: str = Field(..., max_length=500)
