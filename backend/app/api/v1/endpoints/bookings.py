"""
Booking Endpoints
Slot availability, online & offline bookings
"""

from fastapi import APIRouter, HTTPException, Depends, status
from datetime import date
from typing import Optional

from app.schemas.booking import (
    SlotAvailabilityRequest,
    SlotAvailabilityResponse,
    BookingCreate,
    BookingResponse,
    BookingListResponse,
    OfflineBookingCreate,
    BookingCancelRequest,
)
from app.schemas.common import SuccessResponse
from app.services.booking_service import BookingService
from app.api.deps import get_current_user, get_current_owner

router = APIRouter()


@router.get(
    "/slots/{box_id}",
    response_model=SlotAvailabilityResponse,
    summary="Check slot availability"
)
async def check_slot_availability(
    box_id: str,
    booking_date: date,
):
    """
    Check available time slots for a cricket box on a specific date.
    
    Returns list of slots with availability status.
    """
    return await BookingService.get_available_slots(box_id, booking_date)


@router.post(
    "/",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create booking"
)
async def create_booking(
    request: BookingCreate,
    current_user = Depends(get_current_user)
):
    """
    Create a new booking.
    
    - Checks slot availability
    - Creates pending booking
    - Returns booking with payment details
    """
    return await BookingService.create_booking(str(current_user.id), request)


@router.get(
    "/my-bookings",
    response_model=BookingListResponse,
    summary="Get my bookings"
)
async def get_my_bookings(
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
    current_user = Depends(get_current_user)
):
    """
    Get current user's bookings.
    """
    return await BookingService.get_user_bookings(
        str(current_user.id),
        status=status,
        page=page,
        limit=limit
    )


@router.get(
    "/{booking_id}",
    response_model=BookingResponse,
    summary="Get booking details"
)
async def get_booking(
    booking_id: str,
    current_user = Depends(get_current_user)
):
    """
    Get booking details by ID.
    """
    return await BookingService.get_booking_by_id(booking_id, str(current_user.id))


@router.post(
    "/{booking_id}/cancel",
    response_model=SuccessResponse,
    summary="Cancel booking"
)
async def cancel_booking(
    booking_id: str,
    request: BookingCancelRequest,
    current_user = Depends(get_current_user)
):
    """
    Cancel a booking.
    
    - Only pending or confirmed bookings can be cancelled
    - Triggers refund if payment was made
    """
    return await BookingService.cancel_booking(
        booking_id, 
        str(current_user.id),
        request.reason
    )


# Owner Endpoints

@router.post(
    "/offline",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create offline booking (Owner)"
)
async def create_offline_booking(
    box_id: str,
    request: OfflineBookingCreate,
    current_user = Depends(get_current_owner)
):
    """
    Create offline/walk-in booking (Owner only).
    
    Used when customer books via phone or walks in directly.
    """
    return await BookingService.create_offline_booking(
        str(current_user.id),
        box_id,
        request
    )


@router.get(
    "/box/{box_id}",
    response_model=BookingListResponse,
    summary="Get box bookings (Owner)"
)
async def get_box_bookings(
    box_id: str,
    booking_date: Optional[date] = None,
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
    current_user = Depends(get_current_owner)
):
    """
    Get all bookings for a cricket box (Owner only).
    """
    return await BookingService.get_box_bookings(
        box_id,
        str(current_user.id),
        booking_date=booking_date,
        status=status,
        page=page,
        limit=limit
    )
