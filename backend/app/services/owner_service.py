"""
Owner Service - Dashboard stats and box management
"""

from datetime import datetime, date, timedelta
from typing import Optional, List

from app.models.cricket_box import CricketBox
from app.models.booking import Booking, BookingStatus


class OwnerService:
    """Owner service class"""
    
    @staticmethod
    async def get_dashboard_stats(owner_id: str):
        """Get dashboard statistics"""
        today = date.today()
        boxes = await CricketBox.find(CricketBox.owner_id == owner_id).to_list()
        box_ids = [str(b.id) for b in boxes]
        
        if not box_ids:
            return {"total_bookings_today": 0, "total_revenue_today": 0.0}
        
        today_bookings = await Booking.find(
            Booking.cricket_box_id.in_(box_ids),
            Booking.booking_date == today,
        ).to_list()
        
        return {
            "total_bookings_today": len(today_bookings),
            "total_revenue_today": sum(b.total_amount for b in today_bookings),
            "average_rating": sum(b.rating for b in boxes) / len(boxes) if boxes else 0,
        }
    
    @staticmethod
    async def get_owner_boxes(owner_id: str):
        """Get all boxes owned by user"""
        return await CricketBox.find(CricketBox.owner_id == owner_id).to_list()
    
    @staticmethod
    async def get_revenue_data(owner_id: str, start_date=None, end_date=None, box_id=None):
        """Get revenue breakdown"""
        return []
    
    @staticmethod
    async def get_today_schedule(owner_id: str, box_id: str):
        """Get today's schedule"""
        return {"bookings": [], "total": 0, "page": 1, "limit": 100}
    
    @staticmethod
    async def upgrade_subscription(owner_id: str, plan: str):
        """Upgrade subscription"""
        return {"success": True, "message": f"Upgraded to {plan}"}
