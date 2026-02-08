"""
User Endpoints
Profile management
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import Optional

from app.schemas.user import (
    UserProfileUpdate,
    UserProfileResponse,
    UserPublicProfile,
    UserListResponse,
)
from app.schemas.common import SuccessResponse
from app.services.user_service import UserService
from app.api.deps import get_current_user

router = APIRouter()


@router.get(
    "/profile",
    response_model=UserProfileResponse,
    summary="Get my profile"
)
async def get_my_profile(current_user = Depends(get_current_user)):
    """
    Get current user's complete profile.
    """
    return await UserService.get_profile(str(current_user.id))


@router.put(
    "/profile",
    response_model=UserProfileResponse,
    summary="Update my profile"
)
async def update_my_profile(
    request: UserProfileUpdate,
    current_user = Depends(get_current_user)
):
    """
    Update current user's profile.
    """
    return await UserService.update_profile(str(current_user.id), request)


@router.get(
    "/{user_id}",
    response_model=UserPublicProfile,
    summary="Get user's public profile"
)
async def get_user_profile(user_id: str):
    """
    Get a user's public profile (visible to others).
    """
    return await UserService.get_public_profile(user_id)


@router.get(
    "/",
    response_model=UserListResponse,
    summary="List users"
)
async def list_users(
    area: Optional[str] = None,
    skill_level: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
):
    """
    List users with optional filters (for player matching).
    """
    return await UserService.list_users(
        area=area,
        skill_level=skill_level,
        page=page,
        limit=limit
    )


@router.delete(
    "/profile",
    response_model=SuccessResponse,
    summary="Delete my account"
)
async def delete_my_account(current_user = Depends(get_current_user)):
    """
    Delete/deactivate current user's account.
    """
    return await UserService.deactivate_account(str(current_user.id))
