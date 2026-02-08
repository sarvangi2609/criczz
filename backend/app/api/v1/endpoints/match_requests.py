"""
Match Request Endpoints
Player matching / Find team feature
"""

from fastapi import APIRouter, HTTPException, Depends, status
from datetime import date
from typing import Optional

from app.schemas.match_request import (
    MatchRequestCreate,
    MatchRequestUpdate,
    MatchRequestResponse,
    MatchRequestListResponse,
    JoinRequestCreate,
)
from app.schemas.common import SuccessResponse
from app.services.match_request_service import MatchRequestService
from app.api.deps import get_current_user

router = APIRouter()


@router.get(
    "/",
    response_model=MatchRequestListResponse,
    summary="List match requests"
)
async def list_match_requests(
    area: Optional[str] = None,
    match_date: Optional[date] = None,
    skill_level: Optional[str] = None,
    status: Optional[str] = "open",
    page: int = 1,
    limit: int = 10,
):
    """
    List all open match requests with filters.
    
    - Filter by area
    - Filter by date
    - Filter by skill level
    """
    return await MatchRequestService.list_requests(
        area=area,
        match_date=match_date,
        skill_level=skill_level,
        status=status,
        page=page,
        limit=limit
    )


@router.post(
    "/",
    response_model=MatchRequestResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create match request"
)
async def create_match_request(
    request: MatchRequestCreate,
    current_user = Depends(get_current_user)
):
    """
    Create a new match request (Looking for players).
    """
    return await MatchRequestService.create_request(
        str(current_user.id), 
        request
    )


@router.get(
    "/my-requests",
    response_model=MatchRequestListResponse,
    summary="Get my match requests"
)
async def get_my_match_requests(
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
    current_user = Depends(get_current_user)
):
    """
    Get match requests created by current user.
    """
    return await MatchRequestService.get_user_requests(
        str(current_user.id),
        status=status,
        page=page,
        limit=limit
    )


@router.get(
    "/my-joins",
    response_model=MatchRequestListResponse,
    summary="Get requests I joined"
)
async def get_my_joined_requests(
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
    current_user = Depends(get_current_user)
):
    """
    Get match requests where current user has joined/requested.
    """
    return await MatchRequestService.get_user_joined_requests(
        str(current_user.id),
        status=status,
        page=page,
        limit=limit
    )


@router.get(
    "/{request_id}",
    response_model=MatchRequestResponse,
    summary="Get match request details"
)
async def get_match_request(request_id: str):
    """
    Get detailed information about a match request.
    """
    return await MatchRequestService.get_request_by_id(request_id)


@router.put(
    "/{request_id}",
    response_model=MatchRequestResponse,
    summary="Update match request"
)
async def update_match_request(
    request_id: str,
    request: MatchRequestUpdate,
    current_user = Depends(get_current_user)
):
    """
    Update a match request (Creator only).
    """
    return await MatchRequestService.update_request(
        request_id,
        str(current_user.id),
        request
    )


@router.delete(
    "/{request_id}",
    response_model=SuccessResponse,
    summary="Delete match request"
)
async def delete_match_request(
    request_id: str,
    current_user = Depends(get_current_user)
):
    """
    Delete/cancel a match request (Creator only).
    """
    return await MatchRequestService.delete_request(
        request_id,
        str(current_user.id)
    )


# Join Request Endpoints

@router.post(
    "/{request_id}/join",
    response_model=SuccessResponse,
    summary="Request to join match"
)
async def join_match_request(
    request_id: str,
    request: JoinRequestCreate,
    current_user = Depends(get_current_user)
):
    """
    Send a request to join a match.
    """
    return await MatchRequestService.send_join_request(
        request_id,
        str(current_user.id),
        request
    )


@router.post(
    "/{request_id}/accept/{user_id}",
    response_model=SuccessResponse,
    summary="Accept join request"
)
async def accept_join_request(
    request_id: str,
    user_id: str,
    current_user = Depends(get_current_user)
):
    """
    Accept a player's join request (Creator only).
    
    - Creates chat room if first acceptance
    - Adds player to accepted list
    - Sends notification to player
    """
    return await MatchRequestService.accept_join_request(
        request_id,
        str(current_user.id),
        user_id
    )


@router.post(
    "/{request_id}/reject/{user_id}",
    response_model=SuccessResponse,
    summary="Reject join request"
)
async def reject_join_request(
    request_id: str,
    user_id: str,
    current_user = Depends(get_current_user)
):
    """
    Reject a player's join request (Creator only).
    """
    return await MatchRequestService.reject_join_request(
        request_id,
        str(current_user.id),
        user_id
    )


@router.post(
    "/{request_id}/withdraw",
    response_model=SuccessResponse,
    summary="Withdraw my join request"
)
async def withdraw_join_request(
    request_id: str,
    current_user = Depends(get_current_user)
):
    """
    Withdraw my join request from a match.
    """
    return await MatchRequestService.withdraw_join_request(
        request_id,
        str(current_user.id)
    )
