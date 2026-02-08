"""
Cricket Box Schemas
Request/Response models for cricket box endpoints
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class CricketBoxCreate(BaseModel):
    """Create new cricket box request"""
    name: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    address: str
    area: str
    city: str = "Surat"
    pincode: str = Field(..., min_length=6, max_length=6)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    google_maps_url: Optional[str] = None
    price_per_hour: float = Field(..., ge=0)
    weekend_price_per_hour: Optional[float] = None
    opening_time: str = "06:00"
    closing_time: str = "22:00"
    box_type: str = "indoor"
    ground_size: Optional[str] = None
    pitch_type: Optional[str] = None
    max_players: int = 12
    facilities: List[str] = []
    photos: List[str] = []
    cover_photo: Optional[str] = None


class CricketBoxUpdate(BaseModel):
    """Update cricket box request"""
    name: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = None
    address: Optional[str] = None
    area: Optional[str] = None
    price_per_hour: Optional[float] = None
    weekend_price_per_hour: Optional[float] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    facilities: Optional[List[str]] = None
    photos: Optional[List[str]] = None
    cover_photo: Optional[str] = None
    is_active: Optional[bool] = None


class CricketBoxResponse(BaseModel):
    """Cricket box response"""
    id: str
    name: str
    description: Optional[str] = None
    address: str
    area: str
    city: str
    pincode: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    google_maps_url: Optional[str] = None
    price_per_hour: float
    weekend_price_per_hour: Optional[float] = None
    opening_time: str
    closing_time: str
    box_type: str
    ground_size: Optional[str] = None
    pitch_type: Optional[str] = None
    max_players: int
    facilities: List[str]
    photos: List[str]
    cover_photo: Optional[str] = None
    owner_id: str
    owner_name: Optional[str] = None
    rating: float
    total_reviews: int
    total_bookings: int
    is_featured: bool
    is_active: bool
    created_at: datetime


class CricketBoxListResponse(BaseModel):
    """List of cricket boxes response"""
    boxes: List[CricketBoxResponse]
    total: int
    page: int
    limit: int


class CricketBoxFilter(BaseModel):
    """Cricket box filter parameters"""
    area: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    box_type: Optional[str] = None
    facilities: Optional[List[str]] = None
    min_rating: Optional[float] = None
    search: Optional[str] = None
