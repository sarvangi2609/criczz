"""
Favorite Model
Stores user's favorite/saved cricket boxes
"""

from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field


class Favorite(Document):
    """
    Favorite document model for MongoDB
    
    Stores user's saved/favorite cricket boxes
    """
    
    # References
    user_id: str = Field(...)
    cricket_box_id: str = Field(...)
    
    # Denormalized data for quick display
    cricket_box_name: Optional[str] = None
    cricket_box_photo: Optional[str] = None
    cricket_box_area: Optional[str] = None
    cricket_box_price: Optional[float] = None
    cricket_box_rating: Optional[float] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "favorites"
