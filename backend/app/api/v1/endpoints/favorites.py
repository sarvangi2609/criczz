"""
Favorites Endpoints
Save/unsave cricket boxes
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List

from app.schemas.cricket_box import CricketBoxResponse
from app.schemas.common import SuccessResponse
from app.services.favorite_service import FavoriteService
from app.api.deps import get_current_user

router = APIRouter()


@router.get(
    "/",
    response_model=List[CricketBoxResponse],
    summary="Get my favorites"
)
async def get_my_favorites(
    current_user = Depends(get_current_user)
):
    """
    Get all favorited cricket boxes.
    """
    return await FavoriteService.get_user_favorites(str(current_user.id))


@router.post(
    "/{box_id}",
    response_model=SuccessResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add to favorites"
)
async def add_to_favorites(
    box_id: str,
    current_user = Depends(get_current_user)
):
    """
    Add a cricket box to favorites.
    """
    return await FavoriteService.add_favorite(
        str(current_user.id),
        box_id
    )


@router.delete(
    "/{box_id}",
    response_model=SuccessResponse,
    summary="Remove from favorites"
)
async def remove_from_favorites(
    box_id: str,
    current_user = Depends(get_current_user)
):
    """
    Remove a cricket box from favorites.
    """
    return await FavoriteService.remove_favorite(
        str(current_user.id),
        box_id
    )


@router.get(
    "/check/{box_id}",
    response_model=bool,
    summary="Check if favorited"
)
async def check_if_favorited(
    box_id: str,
    current_user = Depends(get_current_user)
):
    """
    Check if a box is in user's favorites.
    """
    return await FavoriteService.is_favorited(
        str(current_user.id),
        box_id
    )
