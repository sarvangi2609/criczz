"""
Review Service
Business logic for reviews
"""

from datetime import datetime
from typing import Optional
from fastapi import HTTPException, status

from app.models.review import Review
from app.models.cricket_box import CricketBox
from app.models.booking import Booking, BookingStatus
from app.models.user import User
from app.schemas.review import (
    ReviewCreate,
    ReviewUpdate,
    ReviewResponse,
    ReviewListResponse,
)
from app.schemas.common import SuccessResponse


class ReviewService:
    """Review service class"""
    
    @staticmethod
    def _to_response(review: Review) -> ReviewResponse:
        """Convert model to response"""
        return ReviewResponse(
            id=str(review.id),
            user_id=review.user_id,
            user_name=review.user_name,
            user_photo=review.user_photo,
            cricket_box_id=review.cricket_box_id,
            cricket_box_name=review.cricket_box_name,
            rating=review.rating,
            title=review.title,
            review_text=review.review_text,
            cleanliness_rating=review.cleanliness_rating,
            facilities_rating=review.facilities_rating,
            value_for_money_rating=review.value_for_money_rating,
            staff_behavior_rating=review.staff_behavior_rating,
            photos=review.photos,
            owner_response=review.owner_response,
            owner_responded_at=review.owner_responded_at,
            is_verified=review.is_verified,
            helpful_count=review.helpful_count,
            created_at=review.created_at,
        )
    
    @staticmethod
    async def get_box_reviews(
        box_id: str,
        sort_by: str = "recent",
        page: int = 1,
        limit: int = 10,
    ) -> ReviewListResponse:
        """Get all reviews for a cricket box"""
        query = Review.find(
            Review.cricket_box_id == box_id,
            Review.is_visible == True,
        )
        
        # Sort
        if sort_by == "recent":
            query = query.sort(-Review.created_at)
        elif sort_by == "rating_high":
            query = query.sort(-Review.rating)
        elif sort_by == "rating_low":
            query = query.sort(Review.rating)
        elif sort_by == "helpful":
            query = query.sort(-Review.helpful_count)
        
        total = await query.count()
        
        # Calculate average rating
        all_reviews = await Review.find(
            Review.cricket_box_id == box_id,
            Review.is_visible == True,
        ).to_list()
        
        average_rating = 0.0
        if all_reviews:
            average_rating = sum(r.rating for r in all_reviews) / len(all_reviews)
        
        skip = (page - 1) * limit
        reviews = await query.skip(skip).limit(limit).to_list()
        
        return ReviewListResponse(
            reviews=[ReviewService._to_response(r) for r in reviews],
            total=total,
            average_rating=round(average_rating, 1),
            page=page,
            limit=limit,
        )
    
    @staticmethod
    async def create_review(
        user_id: str,
        request: ReviewCreate
    ) -> ReviewResponse:
        """Create a new review"""
        user = await User.get(user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        box = await CricketBox.get(request.cricket_box_id)
        
        if not box:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cricket box not found"
            )
        
        # Check if already reviewed
        existing = await Review.find_one(
            Review.user_id == user_id,
            Review.cricket_box_id == request.cricket_box_id,
        )
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already reviewed this box"
            )
        
        # Check if user has a completed booking (verified review)
        is_verified = False
        if request.booking_id:
            booking = await Booking.get(request.booking_id)
            if booking and booking.user_id == user_id and booking.booking_status == BookingStatus.COMPLETED:
                is_verified = True
        
        review = Review(
            user_id=user_id,
            user_name=user.name,
            user_photo=user.profile_photo,
            cricket_box_id=request.cricket_box_id,
            cricket_box_name=box.name,
            booking_id=request.booking_id,
            rating=request.rating,
            title=request.title,
            review_text=request.review_text,
            cleanliness_rating=request.cleanliness_rating,
            facilities_rating=request.facilities_rating,
            value_for_money_rating=request.value_for_money_rating,
            staff_behavior_rating=request.staff_behavior_rating,
            photos=request.photos,
            is_verified=is_verified,
        )
        
        await review.insert()
        
        # Update box rating
        await ReviewService._update_box_rating(request.cricket_box_id)
        
        return ReviewService._to_response(review)
    
    @staticmethod
    async def _update_box_rating(box_id: str):
        """Update cricket box average rating"""
        reviews = await Review.find(
            Review.cricket_box_id == box_id,
            Review.is_visible == True,
        ).to_list()
        
        box = await CricketBox.get(box_id)
        
        if box and reviews:
            average_rating = sum(r.rating for r in reviews) / len(reviews)
            box.rating = round(average_rating, 1)
            box.total_reviews = len(reviews)
            await box.save()
    
    @staticmethod
    async def update_review(
        review_id: str,
        user_id: str,
        request: ReviewUpdate
    ) -> ReviewResponse:
        """Update user's own review"""
        review = await Review.get(review_id)
        
        if not review:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Review not found"
            )
        
        if review.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own reviews"
            )
        
        update_data = request.model_dump(exclude_none=True)
        
        for field, value in update_data.items():
            setattr(review, field, value)
        
        review.updated_at = datetime.utcnow()
        await review.save()
        
        # Update box rating if rating changed
        if "rating" in update_data:
            await ReviewService._update_box_rating(review.cricket_box_id)
        
        return ReviewService._to_response(review)
    
    @staticmethod
    async def delete_review(
        review_id: str,
        user_id: str
    ) -> SuccessResponse:
        """Delete user's own review"""
        review = await Review.get(review_id)
        
        if not review:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Review not found"
            )
        
        if review.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own reviews"
            )
        
        box_id = review.cricket_box_id
        
        await review.delete()
        
        # Update box rating
        await ReviewService._update_box_rating(box_id)
        
        return SuccessResponse(message="Review deleted successfully")
    
    @staticmethod
    async def mark_helpful(
        review_id: str,
        user_id: str
    ) -> SuccessResponse:
        """Mark review as helpful"""
        review = await Review.get(review_id)
        
        if not review:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Review not found"
            )
        
        if user_id in review.helpful_by:
            # Already marked, remove
            review.helpful_by.remove(user_id)
            review.helpful_count -= 1
        else:
            # Add mark
            review.helpful_by.append(user_id)
            review.helpful_count += 1
        
        await review.save()
        
        return SuccessResponse(message="Review helpfulness updated")
    
    @staticmethod
    async def owner_respond(
        review_id: str,
        owner_id: str,
        response: str
    ) -> ReviewResponse:
        """Owner responds to a review"""
        review = await Review.get(review_id)
        
        if not review:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Review not found"
            )
        
        # Verify owner
        box = await CricketBox.get(review.cricket_box_id)
        
        if not box or box.owner_id != owner_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the box owner can respond"
            )
        
        review.owner_response = response
        review.owner_responded_at = datetime.utcnow()
        await review.save()
        
        return ReviewService._to_response(review)
