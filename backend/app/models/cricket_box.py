"""
Cricket Box Model
Stores cricket box/venue information
"""

from datetime import datetime, time
from typing import Optional, List
from beanie import Document, Link
from pydantic import Field
from enum import Enum


class BoxFacility(str, Enum):
    """Available facilities at cricket box"""
    PARKING = "parking"
    LIGHTS = "lights"
    WASHROOM = "washroom"
    CHANGING_ROOM = "changing_room"
    DRINKING_WATER = "drinking_water"
    AC_WAITING = "ac_waiting"
    CCTV = "cctv"
    FIRST_AID = "first_aid"
    EQUIPMENT_RENTAL = "equipment_rental"
    CANTEEN = "canteen"


class BoxType(str, Enum):
    """Type of cricket box"""
    INDOOR = "indoor"
    OUTDOOR = "outdoor"
    SEMI_INDOOR = "semi_indoor"


class SubscriptionPlan(str, Enum):
    """Owner subscription plans"""
    FREE = "free"
    BASIC = "basic"
    PRO = "pro"


class TimeSlot(str, Enum):
    """Predefined time slots"""
    SLOT_6_7 = "06:00-07:00"
    SLOT_7_8 = "07:00-08:00"
    SLOT_8_9 = "08:00-09:00"
    SLOT_9_10 = "09:00-10:00"
    SLOT_10_11 = "10:00-11:00"
    SLOT_11_12 = "11:00-12:00"
    SLOT_12_13 = "12:00-13:00"
    SLOT_13_14 = "13:00-14:00"
    SLOT_14_15 = "14:00-15:00"
    SLOT_15_16 = "15:00-16:00"
    SLOT_16_17 = "16:00-17:00"
    SLOT_17_18 = "17:00-18:00"
    SLOT_18_19 = "18:00-19:00"
    SLOT_19_20 = "19:00-20:00"
    SLOT_20_21 = "20:00-21:00"
    SLOT_21_22 = "21:00-22:00"


class CricketBox(Document):
    """
    Cricket Box document model for MongoDB
    
    Stores all information about a cricket box/venue
    """
    
    # Basic Information
    name: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    
    # Location
    address: str = Field(...)
    area: str = Field(...)  # Vesu, Adajan, Varachha, etc.
    city: str = Field(default="Surat")
    pincode: str = Field(..., min_length=6, max_length=6)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    google_maps_url: Optional[str] = None
    
    # Pricing
    price_per_hour: float = Field(..., ge=0)
    weekend_price_per_hour: Optional[float] = None  # Higher on weekends
    
    # Timing
    opening_time: str = Field(default="06:00")  # Format: HH:MM
    closing_time: str = Field(default="22:00")
    slot_duration_minutes: int = Field(default=60)  # 60 minutes per slot
    
    # Box Details
    box_type: BoxType = Field(default=BoxType.INDOOR)
    ground_size: Optional[str] = None  # "30x40 feet"
    pitch_type: Optional[str] = None  # "Turf", "Matting", "Cement"
    max_players: int = Field(default=12)
    
    # Facilities
    facilities: List[BoxFacility] = Field(default=[])
    
    # Media
    photos: List[str] = Field(default=[])  # S3 URLs
    cover_photo: Optional[str] = None  # Main photo
    video_url: Optional[str] = None  # Optional video tour
    
    # Owner
    owner_id: str = Field(...)  # Reference to User
    owner_name: Optional[str] = None
    owner_phone: Optional[str] = None
    
    # Stats & Ratings
    rating: float = Field(default=0.0)
    total_reviews: int = Field(default=0)
    total_bookings: int = Field(default=0)
    
    # Subscription & Listing
    subscription_plan: SubscriptionPlan = Field(default=SubscriptionPlan.FREE)
    is_featured: bool = Field(default=False)
    featured_until: Optional[datetime] = None
    
    # Status
    is_active: bool = Field(default=True)
    is_approved: bool = Field(default=False)  # Admin approval
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "cricket_boxes"
        
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Green Turf Cricket Box",
                "address": "Near Vesu Lake Garden",
                "area": "Vesu",
                "city": "Surat",
                "pincode": "395007",
                "price_per_hour": 800,
                "box_type": "indoor",
                "facilities": ["parking", "lights", "washroom"],
            }
        }
