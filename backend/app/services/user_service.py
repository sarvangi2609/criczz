"""
User Service
Business logic for user operations
"""

from datetime import datetime
from typing import Optional, List
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import (
    UserProfileUpdate,
    UserProfileResponse,
    UserPublicProfile,
    UserListResponse,
)
from app.schemas.common import SuccessResponse


class UserService:
    """User service class"""
    
    @staticmethod
    async def get_profile(user_id: str) -> UserProfileResponse:
        """Get user's complete profile"""
        user = await User.get(user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserProfileResponse(
            id=str(user.id),
            name=user.name,
            email=user.email,
            phone=user.phone,
            profile_photo=user.profile_photo,
            role=user.role,
            skill_level=user.skill_level,
            area=user.area,
            preferred_time=user.preferred_time,
            total_matches_played=user.total_matches_played,
            rating=user.rating,
            is_verified=user.is_verified,
            created_at=user.created_at,
        )
    
    @staticmethod
    async def update_profile(
        user_id: str, 
        request: UserProfileUpdate
    ) -> UserProfileResponse:
        """Update user's profile"""
        user = await User.get(user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update fields
        update_data = request.model_dump(exclude_none=True)
        
        for field, value in update_data.items():
            setattr(user, field, value)
        
        user.updated_at = datetime.utcnow()
        await user.save()
        
        return await UserService.get_profile(user_id)
    
    @staticmethod
    async def get_public_profile(user_id: str) -> UserPublicProfile:
        """Get user's public profile"""
        user = await User.get(user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserPublicProfile(
            id=str(user.id),
            name=user.name,
            profile_photo=user.profile_photo,
            skill_level=user.skill_level,
            area=user.area,
            total_matches_played=user.total_matches_played,
            rating=user.rating,
        )
    
    @staticmethod
    async def list_users(
        area: Optional[str] = None,
        skill_level: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
    ) -> UserListResponse:
        """List users with filters"""
        query = User.find(User.is_active == True)
        
        if area:
            query = query.find(User.area == area)
        
        if skill_level:
            query = query.find(User.skill_level == skill_level)
        
        # Count total
        total = await query.count()
        
        # Paginate
        skip = (page - 1) * limit
        users = await query.skip(skip).limit(limit).to_list()
        
        user_profiles = [
            UserPublicProfile(
                id=str(u.id),
                name=u.name,
                profile_photo=u.profile_photo,
                skill_level=u.skill_level,
                area=u.area,
                total_matches_played=u.total_matches_played,
                rating=u.rating,
            )
            for u in users
        ]
        
        return UserListResponse(
            users=user_profiles,
            total=total,
            page=page,
            limit=limit,
        )
    
    @staticmethod
    async def deactivate_account(user_id: str) -> SuccessResponse:
        """Deactivate user account"""
        user = await User.get(user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user.is_active = False
        user.updated_at = datetime.utcnow()
        await user.save()
        
        return SuccessResponse(message="Account deactivated successfully")
