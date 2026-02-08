"""
Admin Endpoints
Platform administration
"""

from fastapi import APIRouter, HTTPException, Depends, status
from datetime import date
from typing import Optional
from pydantic import BaseModel

from app.schemas.user import UserListResponse, UserProfileResponse
from app.schemas.cricket_box import CricketBoxListResponse, CricketBoxResponse
from app.schemas.common import SuccessResponse
from app.services.admin_service import AdminService
from app.api.deps import get_current_admin

router = APIRouter()


class PlatformStats(BaseModel):
    """Platform-wide statistics"""
    total_users: int
    total_owners: int
    total_boxes: int
    total_bookings: int
    total_revenue: float
    platform_commission: float
    active_match_requests: int
    pending_box_approvals: int


@router.get(
    "/stats",
    response_model=PlatformStats,
    summary="Get platform stats"
)
async def get_platform_stats(
    current_user = Depends(get_current_admin)
):
    """
    Get platform-wide statistics.
    """
    return await AdminService.get_platform_stats()


# User Management

@router.get(
    "/users",
    response_model=UserListResponse,
    summary="List all users"
)
async def list_all_users(
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    current_user = Depends(get_current_admin)
):
    """
    List all users with filters.
    """
    return await AdminService.list_users(
        role=role,
        is_active=is_active,
        search=search,
        page=page,
        limit=limit
    )


@router.put(
    "/users/{user_id}/status",
    response_model=SuccessResponse,
    summary="Update user status"
)
async def update_user_status(
    user_id: str,
    is_active: bool,
    current_user = Depends(get_current_admin)
):
    """
    Activate/deactivate a user.
    """
    return await AdminService.update_user_status(user_id, is_active)


@router.put(
    "/users/{user_id}/role",
    response_model=SuccessResponse,
    summary="Update user role"
)
async def update_user_role(
    user_id: str,
    role: str,
    current_user = Depends(get_current_admin)
):
    """
    Change user's role.
    """
    return await AdminService.update_user_role(user_id, role)


# Box Management

@router.get(
    "/boxes/pending",
    response_model=CricketBoxListResponse,
    summary="Get pending approvals"
)
async def get_pending_approvals(
    page: int = 1,
    limit: int = 20,
    current_user = Depends(get_current_admin)
):
    """
    Get cricket boxes pending approval.
    """
    return await AdminService.get_pending_boxes(page, limit)


@router.post(
    "/boxes/{box_id}/approve",
    response_model=SuccessResponse,
    summary="Approve box"
)
async def approve_box(
    box_id: str,
    current_user = Depends(get_current_admin)
):
    """
    Approve a cricket box listing.
    """
    return await AdminService.approve_box(box_id)


@router.post(
    "/boxes/{box_id}/reject",
    response_model=SuccessResponse,
    summary="Reject box"
)
async def reject_box(
    box_id: str,
    reason: str,
    current_user = Depends(get_current_admin)
):
    """
    Reject a cricket box listing.
    """
    return await AdminService.reject_box(box_id, reason)


@router.post(
    "/boxes/{box_id}/feature",
    response_model=SuccessResponse,
    summary="Feature a box"
)
async def feature_box(
    box_id: str,
    days: int = 7,
    current_user = Depends(get_current_admin)
):
    """
    Mark a box as featured.
    """
    return await AdminService.feature_box(box_id, days)


# Revenue Reports

@router.get(
    "/revenue",
    summary="Get revenue report"
)
async def get_revenue_report(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user = Depends(get_current_admin)
):
    """
    Get platform revenue report.
    """
    return await AdminService.get_revenue_report(start_date, end_date)
