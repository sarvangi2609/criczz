"""
Admin Service - Platform administration
"""

from datetime import date
from typing import Optional

from app.models.user import User, UserRole
from app.models.cricket_box import CricketBox
from app.models.booking import Booking


class AdminService:
    """Admin service class"""
    
    @staticmethod
    async def get_platform_stats():
        """Get platform statistics"""
        total_users = await User.find(User.role == UserRole.PLAYER).count()
        total_owners = await User.find(User.role == UserRole.OWNER).count()
        total_boxes = await CricketBox.count()
        total_bookings = await Booking.count()
        
        return {
            "total_users": total_users,
            "total_owners": total_owners,
            "total_boxes": total_boxes,
            "total_bookings": total_bookings,
            "total_revenue": 0.0,
            "platform_commission": 0.0,
            "active_match_requests": 0,
            "pending_box_approvals": 0,
        }
    
    @staticmethod
    async def list_users(role=None, is_active=None, search=None, page=1, limit=20):
        """List all users"""
        return {"users": [], "total": 0, "page": page, "limit": limit}
    
    @staticmethod
    async def update_user_status(user_id: str, is_active: bool):
        """Update user status"""
        user = await User.get(user_id)
        if user:
            user.is_active = is_active
            await user.save()
        return {"success": True, "message": "Status updated"}
    
    @staticmethod
    async def update_user_role(user_id: str, role: str):
        """Update user role"""
        return {"success": True, "message": "Role updated"}
    
    @staticmethod
    async def get_pending_boxes(page=1, limit=20):
        """Get pending box approvals"""
        return {"boxes": [], "total": 0, "page": page, "limit": limit}
    
    @staticmethod
    async def approve_box(box_id: str):
        """Approve box"""
        box = await CricketBox.get(box_id)
        if box:
            box.is_approved = True
            await box.save()
        return {"success": True, "message": "Box approved"}
    
    @staticmethod
    async def reject_box(box_id: str, reason: str):
        """Reject box"""
        return {"success": True, "message": "Box rejected"}
    
    @staticmethod
    async def feature_box(box_id: str, days: int):
        """Feature a box"""
        return {"success": True, "message": "Box featured"}
    
    @staticmethod
    async def get_revenue_report(start_date=None, end_date=None):
        """Get revenue report"""
        return {"total_revenue": 0, "platform_commission": 0}
