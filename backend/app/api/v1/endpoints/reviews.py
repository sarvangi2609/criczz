"""
Review Endpoints
Box ratings and reviews
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import Optional

from app.schemas.review import (
    ReviewCreate,
    ReviewUpdate,
    ReviewResponse,
    ReviewListResponse,
    OwnerResponseCreate,
)
from app.schemas.common import SuccessResponse
from app.services.review_service import ReviewService
from app.api.deps import get_current_user, get_current_owner

router = APIRouter()


@router.get(
    "/box/{box_id}",
    response_model=ReviewListResponse,
    summary="Get box reviews"
)
async def get_box_reviews(
    box_id: str,
    sort_by: Optional[str] = "recent",  # recent, rating_high, rating_low
    page: int = 1,
    limit: int = 10,
):
    """
    Get all reviews for a cricket box.
    """
    return await ReviewService.get_box_reviews(
        box_id,
        sort_by=sort_by,
        page=page,
        limit=limit
    )


@router.post(
    "/",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create review"
)
async def create_review(
    request: ReviewCreate,
    current_user = Depends(get_current_user)
):
    """
    Create a review for a cricket box.
    
    - User must have completed booking for verified review
    """
    return await ReviewService.create_review(
        str(current_user.id),
        request
    )


@router.put(
    "/{review_id}",
    response_model=ReviewResponse,
    summary="Update my review"
)
async def update_review(
    review_id: str,
    request: ReviewUpdate,
    current_user = Depends(get_current_user)
):
    """
    Update user's own review.
    """
    return await ReviewService.update_review(
        review_id,
        str(current_user.id),
        request
    )


@router.delete(
    "/{review_id}",
    response_model=SuccessResponse,
    summary="Delete my review"
)
async def delete_review(
    review_id: str,
    current_user = Depends(get_current_user)
):
    """
    Delete user's own review.
    """
    return await ReviewService.delete_review(
        review_id,
        str(current_user.id)
    )


@router.post(
    "/{review_id}/helpful",
    response_model=SuccessResponse,
    summary="Mark review as helpful"
)
async def mark_review_helpful(
    review_id: str,
    current_user = Depends(get_current_user)
):
    """
    Mark a review as helpful.
    """
    return await ReviewService.mark_helpful(
        review_id,
        str(current_user.id)
    )


# Owner Response

@router.post(
    "/{review_id}/respond",
    response_model=ReviewResponse,
    summary="Respond to review (Owner)"
)
async def owner_respond_to_review(
    review_id: str,
    request: OwnerResponseCreate,
    current_user = Depends(get_current_owner)
):
    """
    Owner responds to a customer review.
    """
    return await ReviewService.owner_respond(
        review_id,
        str(current_user.id),
        request.response
    )
