"""
Notification Endpoints
User notifications
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.schemas.common import SuccessResponse
from app.services.notification_service import NotificationService
from app.api.deps import get_current_user

router = APIRouter()


class NotificationResponse(BaseModel):
    id: str
    notification_type: str
    title: str
    message: str
    related_id: Optional[str] = None
    related_type: Optional[str] = None
    action_url: Optional[str] = None
    is_read: bool
    created_at: datetime


class NotificationListResponse(BaseModel):
    notifications: List[NotificationResponse]
    unread_count: int


@router.get(
    "/",
    response_model=NotificationListResponse,
    summary="Get my notifications"
)
async def get_my_notifications(
    is_read: Optional[bool] = None,
    limit: int = 20,
    current_user = Depends(get_current_user)
):
    """
    Get user's notifications.
    """
    return await NotificationService.get_user_notifications(
        str(current_user.id),
        is_read=is_read,
        limit=limit
    )


@router.post(
    "/{notification_id}/read",
    response_model=SuccessResponse,
    summary="Mark as read"
)
async def mark_notification_read(
    notification_id: str,
    current_user = Depends(get_current_user)
):
    """
    Mark a notification as read.
    """
    return await NotificationService.mark_as_read(
        notification_id,
        str(current_user.id)
    )


@router.post(
    "/read-all",
    response_model=SuccessResponse,
    summary="Mark all as read"
)
async def mark_all_notifications_read(
    current_user = Depends(get_current_user)
):
    """
    Mark all notifications as read.
    """
    return await NotificationService.mark_all_as_read(
        str(current_user.id)
    )


@router.delete(
    "/{notification_id}",
    response_model=SuccessResponse,
    summary="Delete notification"
)
async def delete_notification(
    notification_id: str,
    current_user = Depends(get_current_user)
):
    """
    Delete a notification.
    """
    return await NotificationService.delete_notification(
        notification_id,
        str(current_user.id)
    )
