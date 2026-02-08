"""
Review Model
Stores user reviews for cricket boxes
"""

from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field


class Review(Document):
    """
    Review document model for MongoDB
    
    Stores user reviews/ratings for cricket boxes
    """
    
    # References
    user_id: str = Field(...)
    user_name: str = Field(...)
    user_photo: Optional[str] = None
    
    cricket_box_id: str = Field(...)
    cricket_box_name: Optional[str] = None
    
    booking_id: Optional[str] = None  # Link to completed booking
    
    # Rating
    rating: float = Field(..., ge=1, le=5)  # 1-5 stars
    
    # Review Content
    title: Optional[str] = Field(None, max_length=100)
    review_text: Optional[str] = Field(None, max_length=1000)
    
    # Aspects Rating (optional detailed ratings)
    cleanliness_rating: Optional[float] = None
    facilities_rating: Optional[float] = None
    value_for_money_rating: Optional[float] = None
    staff_behavior_rating: Optional[float] = None
    
    # Photos
    photos: list[str] = Field(default=[])  # Review photos
    
    # Owner Response
    owner_response: Optional[str] = None
    owner_responded_at: Optional[datetime] = None
    
    # Status
    is_verified: bool = Field(default=False)  # Verified if booking exists
    is_visible: bool = Field(default=True)
    
    # Helpful votes
    helpful_count: int = Field(default=0)
    helpful_by: list[str] = Field(default=[])  # User IDs
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "reviews"
        
    class Config:
        json_schema_extra = {
            "example": {
                "rating": 4.5,
                "title": "Great experience!",
                "review_text": "Amazing pitch quality and friendly staff.",
            }
        }
