"""
Booking Service
Business logic for booking operations
"""

from datetime import datetime, date, timedelta
from typing import Optional, List
from fastapi import HTTPException, status
import uuid

from app.models.booking import Booking, BookingStatus, BookingType, PaymentStatus
from app.models.cricket_box import CricketBox
from app.models.user import User
from app.schemas.booking import (
    SlotAvailabilityResponse,
    TimeSlot,
    BookingCreate,
    BookingResponse,
    BookingListResponse,
    OfflineBookingCreate,
)
from app.schemas.common import SuccessResponse
from app.core.config import settings


class BookingService:
    """Booking service class"""
    
    @staticmethod
    def _generate_booking_number() -> str:
        """Generate unique booking number"""
        timestamp = datetime.utcnow().strftime("%Y%m%d")
        unique_id = uuid.uuid4().hex[:6].upper()
        return f"CBK-{timestamp}-{unique_id}"
    
    @staticmethod
    def _to_response(booking: Booking) -> BookingResponse:
        """Convert model to response"""
        return BookingResponse(
            id=str(booking.id),
            booking_number=booking.booking_number,
            user_id=booking.user_id,
            user_name=booking.user_name,
            cricket_box_id=booking.cricket_box_id,
            cricket_box_name=booking.cricket_box_name,
            booking_date=booking.booking_date,
            start_time=booking.start_time,
            end_time=booking.end_time,
            duration_hours=booking.duration_hours,
            base_amount=booking.base_amount,
            tax_amount=booking.tax_amount,
            platform_fee=booking.platform_fee,
            total_amount=booking.total_amount,
            payment_status=booking.payment_status,
            booking_status=booking.booking_status,
            booking_type=booking.booking_type,
            created_at=booking.created_at,
        )
    
    @staticmethod
    async def get_available_slots(
        box_id: str,
        booking_date: date
    ) -> SlotAvailabilityResponse:
        """Get available time slots for a box on a date"""
        box = await CricketBox.get(box_id)
        
        if not box:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cricket box not found"
            )
        
        # Get existing bookings for this date
        existing_bookings = await Booking.find(
            Booking.cricket_box_id == box_id,
            Booking.booking_date == booking_date,
            Booking.booking_status.in_([
                BookingStatus.PENDING, 
                BookingStatus.CONFIRMED
            ])
        ).to_list()
        
        booked_slots = {
            (b.start_time, b.end_time): str(b.id) 
            for b in existing_bookings
        }
        
        # Generate time slots
        slots = []
        opening_hour = int(box.opening_time.split(":")[0])
        closing_hour = int(box.closing_time.split(":")[0])
        
        # Check if weekend for pricing
        is_weekend = booking_date.weekday() >= 5
        price = box.weekend_price_per_hour if is_weekend and box.weekend_price_per_hour else box.price_per_hour
        
        for hour in range(opening_hour, closing_hour):
            start_time = f"{hour:02d}:00"
            end_time = f"{hour+1:02d}:00"
            
            is_available = (start_time, end_time) not in booked_slots
            booking_id = booked_slots.get((start_time, end_time))
            
            slots.append(TimeSlot(
                start_time=start_time,
                end_time=end_time,
                is_available=is_available,
                price=price,
                booking_id=booking_id,
            ))
        
        return SlotAvailabilityResponse(
            cricket_box_id=box_id,
            date=booking_date,
            slots=slots,
        )
    
    @staticmethod
    async def create_booking(
        user_id: str,
        request: BookingCreate
    ) -> BookingResponse:
        """Create a new booking"""
        # Get user
        user = await User.get(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Get box
        box = await CricketBox.get(request.cricket_box_id)
        if not box:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cricket box not found"
            )
        
        # Check slot availability
        existing = await Booking.find_one(
            Booking.cricket_box_id == request.cricket_box_id,
            Booking.booking_date == request.booking_date,
            Booking.start_time == request.start_time,
            Booking.booking_status.in_([
                BookingStatus.PENDING, 
                BookingStatus.CONFIRMED
            ])
        )
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This slot is already booked"
            )
        
        # Calculate pricing
        is_weekend = request.booking_date.weekday() >= 5
        base_amount = box.weekend_price_per_hour if is_weekend and box.weekend_price_per_hour else box.price_per_hour
        platform_fee = base_amount * (settings.PLATFORM_COMMISSION_PERCENT / 100)
        tax_amount = 0  # Add GST if needed
        total_amount = base_amount + platform_fee + tax_amount
        
        # Create booking
        booking = Booking(
            booking_number=BookingService._generate_booking_number(),
            user_id=user_id,
            user_name=user.name,
            user_phone=user.phone,
            cricket_box_id=str(box.id),
            cricket_box_name=box.name,
            owner_id=box.owner_id,
            booking_date=request.booking_date,
            start_time=request.start_time,
            end_time=request.end_time,
            duration_hours=1.0,
            base_amount=base_amount,
            tax_amount=tax_amount,
            platform_fee=platform_fee,
            total_amount=total_amount,
            booking_status=BookingStatus.PENDING,
            booking_type=BookingType.ONLINE,
            user_notes=request.user_notes,
            match_request_id=request.match_request_id,
        )
        
        await booking.insert()
        
        return BookingService._to_response(booking)
    
    @staticmethod
    async def get_user_bookings(
        user_id: str,
        status: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
    ) -> BookingListResponse:
        """Get user's bookings"""
        query = Booking.find(Booking.user_id == user_id)
        
        if status:
            query = query.find(Booking.booking_status == status)
        
        total = await query.count()
        
        skip = (page - 1) * limit
        bookings = await query.sort(-Booking.created_at).skip(skip).limit(limit).to_list()
        
        return BookingListResponse(
            bookings=[BookingService._to_response(b) for b in bookings],
            total=total,
            page=page,
            limit=limit,
        )
    
    @staticmethod
    async def get_booking_by_id(
        booking_id: str,
        user_id: str
    ) -> BookingResponse:
        """Get booking details"""
        booking = await Booking.get(booking_id)
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        # Check access
        if booking.user_id != user_id and booking.owner_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        return BookingService._to_response(booking)
    
    @staticmethod
    async def cancel_booking(
        booking_id: str,
        user_id: str,
        reason: str
    ) -> SuccessResponse:
        """Cancel a booking"""
        booking = await Booking.get(booking_id)
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        if booking.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only cancel your own bookings"
            )
        
        if booking.booking_status not in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This booking cannot be cancelled"
            )
        
        booking.booking_status = BookingStatus.CANCELLED
        booking.cancellation_reason = reason
        booking.cancelled_at = datetime.utcnow()
        booking.updated_at = datetime.utcnow()
        await booking.save()
        
        # TODO: Process refund if payment was made
        
        return SuccessResponse(message="Booking cancelled successfully")
    
    @staticmethod
    async def create_offline_booking(
        owner_id: str,
        box_id: str,
        request: OfflineBookingCreate
    ) -> BookingResponse:
        """Create offline/walk-in booking (by owner)"""
        box = await CricketBox.get(box_id)
        
        if not box:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cricket box not found"
            )
        
        if box.owner_id != owner_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only add bookings to your own box"
            )
        
        # Check slot availability
        existing = await Booking.find_one(
            Booking.cricket_box_id == box_id,
            Booking.booking_date == request.booking_date,
            Booking.start_time == request.start_time,
            Booking.booking_status.in_([
                BookingStatus.PENDING, 
                BookingStatus.CONFIRMED
            ])
        )
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This slot is already booked"
            )
        
        # Create offline booking
        booking = Booking(
            booking_number=BookingService._generate_booking_number(),
            user_id=owner_id,  # Owner is the booker for offline
            user_name=request.customer_name,
            user_phone=request.customer_phone,
            cricket_box_id=str(box.id),
            cricket_box_name=box.name,
            owner_id=owner_id,
            booking_date=request.booking_date,
            start_time=request.start_time,
            end_time=request.end_time,
            duration_hours=1.0,
            base_amount=request.amount_collected,
            total_amount=request.amount_collected,
            payment_status=PaymentStatus.PAID,
            booking_status=BookingStatus.CONFIRMED,
            booking_type=BookingType.OFFLINE,
            owner_notes=request.owner_notes,
        )
        
        await booking.insert()
        
        # Update box stats
        box.total_bookings += 1
        await box.save()
        
        return BookingService._to_response(booking)
    
    @staticmethod
    async def get_box_bookings(
        box_id: str,
        owner_id: str,
        booking_date: Optional[date] = None,
        status: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
    ) -> BookingListResponse:
        """Get all bookings for a box (owner only)"""
        box = await CricketBox.get(box_id)
        
        if not box:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cricket box not found"
            )
        
        if box.owner_id != owner_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        query = Booking.find(Booking.cricket_box_id == box_id)
        
        if booking_date:
            query = query.find(Booking.booking_date == booking_date)
        
        if status:
            query = query.find(Booking.booking_status == status)
        
        total = await query.count()
        
        skip = (page - 1) * limit
        bookings = await query.sort(Booking.start_time).skip(skip).limit(limit).to_list()
        
        return BookingListResponse(
            bookings=[BookingService._to_response(b) for b in bookings],
            total=total,
            page=page,
            limit=limit,
        )
