"""
Favorite Service
Business logic for favorites
"""

from typing import List
from fastapi import HTTPException, status

from app.models.favorite import Favorite
from app.models.cricket_box import CricketBox
from app.schemas.cricket_box import CricketBoxResponse
from app.schemas.common import SuccessResponse


class FavoriteService:
    """Favorite service class"""
    
    @staticmethod
    async def get_user_favorites(user_id: str) -> List[CricketBoxResponse]:
        """Get all favorited boxes for a user"""
        favorites = await Favorite.find(
            Favorite.user_id == user_id
        ).to_list()
        
        boxes = []
        for fav in favorites:
            box = await CricketBox.get(fav.cricket_box_id)
            if box and box.is_active:
                boxes.append(CricketBoxResponse(
                    id=str(box.id),
                    name=box.name,
                    description=box.description,
                    address=box.address,
                    area=box.area,
                    city=box.city,
                    pincode=box.pincode,
                    latitude=box.latitude,
                    longitude=box.longitude,
                    google_maps_url=box.google_maps_url,
                    price_per_hour=box.price_per_hour,
                    weekend_price_per_hour=box.weekend_price_per_hour,
                    opening_time=box.opening_time,
                    closing_time=box.closing_time,
                    box_type=box.box_type,
                    ground_size=box.ground_size,
                    pitch_type=box.pitch_type,
                    max_players=box.max_players,
                    facilities=[f.value if hasattr(f, 'value') else f for f in box.facilities],
                    photos=box.photos,
                    cover_photo=box.cover_photo,
                    owner_id=box.owner_id,
                    owner_name=box.owner_name,
                    rating=box.rating,
                    total_reviews=box.total_reviews,
                    total_bookings=box.total_bookings,
                    is_featured=box.is_featured,
                    is_active=box.is_active,
                    created_at=box.created_at,
                ))
        
        return boxes
    
    @staticmethod
    async def add_favorite(user_id: str, box_id: str) -> SuccessResponse:
        """Add box to favorites"""
        box = await CricketBox.get(box_id)
        
        if not box:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cricket box not found"
            )
        
        # Check if already favorited
        existing = await Favorite.find_one(
            Favorite.user_id == user_id,
            Favorite.cricket_box_id == box_id,
        )
        
        if existing:
            return SuccessResponse(message="Already in favorites")
        
        favorite = Favorite(
            user_id=user_id,
            cricket_box_id=box_id,
            cricket_box_name=box.name,
            cricket_box_photo=box.cover_photo,
            cricket_box_area=box.area,
            cricket_box_price=box.price_per_hour,
            cricket_box_rating=box.rating,
        )
        
        await favorite.insert()
        
        return SuccessResponse(message="Added to favorites")
    
    @staticmethod
    async def remove_favorite(user_id: str, box_id: str) -> SuccessResponse:
        """Remove box from favorites"""
        favorite = await Favorite.find_one(
            Favorite.user_id == user_id,
            Favorite.cricket_box_id == box_id,
        )
        
        if favorite:
            await favorite.delete()
        
        return SuccessResponse(message="Removed from favorites")
    
    @staticmethod
    async def is_favorited(user_id: str, box_id: str) -> bool:
        """Check if box is in user's favorites"""
        favorite = await Favorite.find_one(
            Favorite.user_id == user_id,
            Favorite.cricket_box_id == box_id,
        )
        
        return favorite is not None
