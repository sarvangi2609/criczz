"""
Booking Model
Stores all booking information for cricket boxes
"""

from datetime import datetime, date
from typing import Optional
from beanie import Document
from pydantic import Field
from enum import Enum


class BookingStatus(str, Enum):
    """Booking status types"""
    PENDING = "pending"          # Waiting for payment
    CONFIRMED = "confirmed"      # Payment done, slot booked
    CANCELLED = "cancelled"      # Cancelled by user/owner
    COMPLETED = "completed"      # Match finished
    NO_SHOW = "no_show"          # User didn't show up


class BookingType(str, Enum):
    """Type of booking"""
    ONLINE = "online"    # Booked through website
    OFFLINE = "offline"  # Walk-in or phone booking by owner


class PaymentStatus(str, Enum):
    """Payment status"""
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class Booking(Document):
    """
    Booking document model for MongoDB
    
    Stores booking information for cricket box slots
    """
    
    # Booking Identification
    booking_number: str = Field(...)  # CBK-2024-001234
    
    # References
    user_id: str = Field(...)  # Who booked
    user_name: Optional[str] = None
    user_phone: Optional[str] = None
    
    cricket_box_id: str = Field(...)  # Which box
    cricket_box_name: Optional[str] = None
    owner_id: str = Field(...)  # Box owner
    
    # Booking Details
    booking_date: date = Field(...)  # Date of the match
    start_time: str = Field(...)  # "18:00"
    end_time: str = Field(...)    # "19:00"
    duration_hours: float = Field(default=1.0)
    
    # Pricing
    base_amount: float = Field(...)  # Box rate
    tax_amount: float = Field(default=0.0)
    platform_fee: float = Field(default=0.0)
    discount_amount: float = Field(default=0.0)
    total_amount: float = Field(...)  # Final amount
    
    # Payment
    payment_status: PaymentStatus = Field(default=PaymentStatus.PENDING)
    payment_id: Optional[str] = None  # Razorpay payment ID
    payment_order_id: Optional[str] = None  # Razorpay order ID
    payment_method: Optional[str] = None  # UPI, Card, NetBanking
    paid_at: Optional[datetime] = None
    
    # Status
    booking_status: BookingStatus = Field(default=BookingStatus.PENDING)
    booking_type: BookingType = Field(default=BookingType.ONLINE)
    
    # Match Request Link (if booked through player matching)
    match_request_id: Optional[str] = None
    
    # Notes
    user_notes: Optional[str] = None
    owner_notes: Optional[str] = None
    cancellation_reason: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    cancelled_at: Optional[datetime] = None
    
    class Settings:
        name = "bookings"
        
    class Config:
        json_schema_extra = {
            "example": {
                "booking_number": "CBK-2024-001234",
                "booking_date": "2024-01-25",
                "start_time": "18:00",
                "end_time": "19:00",
                "total_amount": 800,
                "booking_status": "confirmed",
                "booking_type": "online",
            }
        }
