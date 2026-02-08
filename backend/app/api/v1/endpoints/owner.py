"""
Owner Dashboard Endpoints
Box owner specific features
"""

from fastapi import APIRouter, HTTPException, Depends, status
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel

from app.schemas.booking import BookingListResponse
from app.schemas.cricket_box import CricketBoxResponse
from app.schemas.common import SuccessResponse
from app.services.owner_service import OwnerService
from app.api.deps import get_current_owner

router = APIRouter()


class DashboardStats(BaseModel):
    """Owner dashboard statistics"""
    total_bookings_today: int
    total_revenue_today: float
    total_bookings_month: int
    total_revenue_month: float
    upcoming_bookings: int
    pending_payments: int
    average_rating: float
    total_reviews: int


class RevenueData(BaseModel):
    """Revenue breakdown"""
    date: date
    online_revenue: float
    offline_revenue: float
    total_revenue: float
    booking_count: int


@router.get(
    "/dashboard",
    response_model=DashboardStats,
    summary="Get dashboard stats"
)
async def get_dashboard_stats(
    current_user = Depends(get_current_owner)
):
    """
    Get owner's dashboard statistics.
    
    - Today's bookings and revenue
    - Monthly bookings and revenue
    - Upcoming bookings
    - Rating overview
    """
    return await OwnerService.get_dashboard_stats(str(current_user.id))


@router.get(
    "/my-boxes",
    response_model=list[CricketBoxResponse],
    summary="Get my cricket boxes"
)
async def get_my_boxes(
    current_user = Depends(get_current_owner)
):
    """
    Get all cricket boxes owned by current user.
    """
    return await OwnerService.get_owner_boxes(str(current_user.id))


@router.get(
    "/revenue",
    response_model=list[RevenueData],
    summary="Get revenue data"
)
async def get_revenue_data(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    box_id: Optional[str] = None,
    current_user = Depends(get_current_owner)
):
    """
    Get revenue breakdown by date.
    """
    return await OwnerService.get_revenue_data(
        str(current_user.id),
        start_date=start_date,
        end_date=end_date,
        box_id=box_id
    )


@router.get(
    "/today-schedule/{box_id}",
    response_model=BookingListResponse,
    summary="Get today's schedule"
)
async def get_today_schedule(
    box_id: str,
    current_user = Depends(get_current_owner)
):
    """
    Get today's booking schedule for a box.
    """
    return await OwnerService.get_today_schedule(
        str(current_user.id),
        box_id
    )


@router.post(
    "/upgrade-subscription",
    response_model=SuccessResponse,
    summary="Upgrade subscription"
)
async def upgrade_subscription(
    plan: str,  # basic, pro
    current_user = Depends(get_current_owner)
):
    """
    Upgrade owner's subscription plan.
    """
    return await OwnerService.upgrade_subscription(
        str(current_user.id),
        plan
    )
