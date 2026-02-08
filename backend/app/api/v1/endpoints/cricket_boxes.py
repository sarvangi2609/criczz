"""
Cricket Box Endpoints
Browse, search, and view cricket boxes
"""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import Optional, List

from app.schemas.cricket_box import (
    CricketBoxCreate,
    CricketBoxUpdate,
    CricketBoxResponse,
    CricketBoxListResponse,
)
from app.schemas.common import SuccessResponse
from app.services.cricket_box_service import CricketBoxService
from app.api.deps import get_current_user, get_current_owner

router = APIRouter()


@router.get(
    "/",
    response_model=CricketBoxListResponse,
    summary="List all cricket boxes"
)
async def list_cricket_boxes(
    area: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    box_type: Optional[str] = None,
    facilities: Optional[str] = None,  # Comma-separated
    min_rating: Optional[float] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "rating",  # rating, price, name
    page: int = 1,
    limit: int = 10,
):
    """
    List all cricket boxes with filters.
    
    - Filter by area (Vesu, Adajan, etc.)
    - Filter by price range
    - Filter by box type (indoor, outdoor)
    - Filter by facilities
    - Search by name
    """
    facilities_list = facilities.split(",") if facilities else None
    
    return await CricketBoxService.list_boxes(
        area=area,
        min_price=min_price,
        max_price=max_price,
        box_type=box_type,
        facilities=facilities_list,
        min_rating=min_rating,
        search=search,
        sort_by=sort_by,
        page=page,
        limit=limit
    )


@router.get(
    "/featured",
    response_model=CricketBoxListResponse,
    summary="Get featured boxes"
)
async def get_featured_boxes(limit: int = 5):
    """
    Get featured cricket boxes for homepage.
    """
    return await CricketBoxService.get_featured_boxes(limit)


@router.get(
    "/areas",
    response_model=List[str],
    summary="Get all areas"
)
async def get_all_areas():
    """
    Get list of all unique areas (for filter dropdown).
    """
    return await CricketBoxService.get_all_areas()


@router.get(
    "/{box_id}",
    response_model=CricketBoxResponse,
    summary="Get box details"
)
async def get_cricket_box(box_id: str):
    """
    Get detailed information about a specific cricket box.
    """
    return await CricketBoxService.get_box_by_id(box_id)


@router.post(
    "/",
    response_model=CricketBoxResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new box (Owner)"
)
async def create_cricket_box(
    request: CricketBoxCreate,
    current_user = Depends(get_current_owner)
):
    """
    Create a new cricket box listing (Owner only).
    """
    return await CricketBoxService.create_box(str(current_user.id), request)


@router.put(
    "/{box_id}",
    response_model=CricketBoxResponse,
    summary="Update box (Owner)"
)
async def update_cricket_box(
    box_id: str,
    request: CricketBoxUpdate,
    current_user = Depends(get_current_owner)
):
    """
    Update cricket box details (Owner only).
    """
    return await CricketBoxService.update_box(
        box_id, 
        str(current_user.id), 
        request
    )


@router.delete(
    "/{box_id}",
    response_model=SuccessResponse,
    summary="Delete box (Owner)"
)
async def delete_cricket_box(
    box_id: str,
    current_user = Depends(get_current_owner)
):
    """
    Delete/deactivate cricket box (Owner only).
    """
    return await CricketBoxService.delete_box(box_id, str(current_user.id))
