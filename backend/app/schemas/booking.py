"""
Booking Schemas
Request/Response models for booking endpoints
"""

from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field


class SlotAvailabilityRequest(BaseModel):
    """Check slot availability request"""
    cricket_box_id: str
    date: date


class TimeSlot(BaseModel):
    """Single time slot"""
    start_time: str
    end_time: str
    is_available: bool
    price: float
    booking_id: Optional[str] = None  # If booked


class SlotAvailabilityResponse(BaseModel):
    """Slot availability response"""
    cricket_box_id: str
    date: date
    slots: List[TimeSlot]


class BookingCreate(BaseModel):
    """Create booking request"""
    cricket_box_id: str
    booking_date: date
    start_time: str
    end_time: str
    user_notes: Optional[str] = None
    match_request_id: Optional[str] = None  # If booking for a match request


class BookingResponse(BaseModel):
    """Booking response"""
    id: str
    booking_number: str
    user_id: str
    user_name: Optional[str] = None
    cricket_box_id: str
    cricket_box_name: Optional[str] = None
    booking_date: date
    start_time: str
    end_time: str
    duration_hours: float
    base_amount: float
    tax_amount: float
    platform_fee: float
    total_amount: float
    payment_status: str
    booking_status: str
    booking_type: str
    created_at: datetime


class BookingListResponse(BaseModel):
    """List of bookings response"""
    bookings: List[BookingResponse]
    total: int
    page: int
    limit: int


class OfflineBookingCreate(BaseModel):
    """Create offline booking (by owner)"""
    booking_date: date
    start_time: str
    end_time: str
    customer_name: str
    customer_phone: str
    amount_collected: float
    owner_notes: Optional[str] = None


class BookingCancelRequest(BaseModel):
    """Cancel booking request"""
    reason: str
