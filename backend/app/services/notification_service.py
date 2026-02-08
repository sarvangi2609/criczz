"""
Notification Service
Send notifications to users
"""

from datetime import datetime
from typing import Optional

from app.models.notification import Notification, NotificationType
from app.schemas.common import SuccessResponse
from app.services.websocket_manager import ws_manager


class NotificationService:
    """Notification service class"""
    
    @staticmethod
    async def create_notification(
        user_id: str,
        notification_type: NotificationType,
        title: str,
        message: str,
        related_id: Optional[str] = None,
        related_type: Optional[str] = None,
        action_url: Optional[str] = None,
    ) -> Notification:
        """Create and save a notification"""
        notification = Notification(
            user_id=user_id,
            notification_type=notification_type,
            title=title,
            message=message,
            related_id=related_id,
            related_type=related_type,
            action_url=action_url,
        )
        
        await notification.insert()
        
        # Send via WebSocket if user is online
        if ws_manager.is_user_online(user_id):
            await ws_manager.send_to_user(user_id, {
                "event": "notification",
                "data": {
                    "id": str(notification.id),
                    "type": notification_type,
                    "title": title,
                    "message": message,
                }
            })
        
        return notification
    
    @staticmethod
    async def send_booking_notification(
        user_id: str,
        booking_id: str,
        title: str,
        message: str,
    ):
        """Send booking related notification"""
        await NotificationService.create_notification(
            user_id=user_id,
            notification_type=NotificationType.BOOKING_CONFIRMED,
            title=title,
            message=message,
            related_id=booking_id,
            related_type="booking",
            action_url=f"/bookings/{booking_id}",
        )
    
    @staticmethod
    async def send_match_request_notification(
        user_id: str,
        request_id: str,
        title: str,
        message: str,
    ):
        """Send match request related notification"""
        await NotificationService.create_notification(
            user_id=user_id,
            notification_type=NotificationType.MATCH_REQUEST_JOIN,
            title=title,
            message=message,
            related_id=request_id,
            related_type="match_request",
            action_url=f"/match-requests/{request_id}",
        )
    
    @staticmethod
    async def get_user_notifications(
        user_id: str,
        is_read: Optional[bool] = None,
        limit: int = 20,
    ):
        """Get user's notifications"""
        query = Notification.find(Notification.user_id == user_id)
        
        if is_read is not None:
            query = query.find(Notification.is_read == is_read)
        
        notifications = await query.sort(-Notification.created_at).limit(limit).to_list()
        
        # Count unread
        unread_count = await Notification.find(
            Notification.user_id == user_id,
            Notification.is_read == False,
        ).count()
        
        return {
            "notifications": [
                {
                    "id": str(n.id),
                    "notification_type": n.notification_type,
                    "title": n.title,
                    "message": n.message,
                    "related_id": n.related_id,
                    "related_type": n.related_type,
                    "action_url": n.action_url,
                    "is_read": n.is_read,
                    "created_at": n.created_at,
                }
                for n in notifications
            ],
            "unread_count": unread_count,
        }
    
    @staticmethod
    async def mark_as_read(
        notification_id: str,
        user_id: str,
    ) -> SuccessResponse:
        """Mark notification as read"""
        notification = await Notification.get(notification_id)
        
        if notification and notification.user_id == user_id:
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            await notification.save()
        
        return SuccessResponse(message="Notification marked as read")
    
    @staticmethod
    async def mark_all_as_read(user_id: str) -> SuccessResponse:
        """Mark all notifications as read"""
        notifications = await Notification.find(
            Notification.user_id == user_id,
            Notification.is_read == False,
        ).to_list()
        
        for notification in notifications:
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            await notification.save()
        
        return SuccessResponse(message="All notifications marked as read")
    
    @staticmethod
    async def delete_notification(
        notification_id: str,
        user_id: str,
    ) -> SuccessResponse:
        """Delete a notification"""
        notification = await Notification.get(notification_id)
        
        if notification and notification.user_id == user_id:
            await notification.delete()
        
        return SuccessResponse(message="Notification deleted")
