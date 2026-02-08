"""
Cricket Box Service
Business logic for cricket box operations
"""

from datetime import datetime
from typing import Optional, List
from fastapi import HTTPException, status

from app.models.cricket_box import CricketBox
from app.models.user import User, UserRole
from app.schemas.cricket_box import (
    CricketBoxCreate,
    CricketBoxUpdate,
    CricketBoxResponse,
    CricketBoxListResponse,
)
from app.schemas.common import SuccessResponse


class CricketBoxService:
    """Cricket box service class"""
    
    @staticmethod
    def _to_response(box: CricketBox) -> CricketBoxResponse:
        """Convert model to response"""
        return CricketBoxResponse(
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
        )
    
    @staticmethod
    async def list_boxes(
        area: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        box_type: Optional[str] = None,
        facilities: Optional[List[str]] = None,
        min_rating: Optional[float] = None,
        search: Optional[str] = None,
        sort_by: str = "rating",
        page: int = 1,
        limit: int = 10,
    ) -> CricketBoxListResponse:
        """List cricket boxes with filters"""
        # Base query - only active and approved boxes
        query = CricketBox.find(
            CricketBox.is_active == True,
            CricketBox.is_approved == True
        )
        
        # Apply filters
        if area:
            query = query.find(CricketBox.area == area)
        
        if min_price is not None:
            query = query.find(CricketBox.price_per_hour >= min_price)
        
        if max_price is not None:
            query = query.find(CricketBox.price_per_hour <= max_price)
        
        if box_type:
            query = query.find(CricketBox.box_type == box_type)
        
        if min_rating is not None:
            query = query.find(CricketBox.rating >= min_rating)
        
        # TODO: Add search and facilities filter
        
        # Count total
        total = await query.count()
        
        # Sort
        if sort_by == "rating":
            query = query.sort(-CricketBox.rating)
        elif sort_by == "price":
            query = query.sort(CricketBox.price_per_hour)
        elif sort_by == "name":
            query = query.sort(CricketBox.name)
        
        # Paginate
        skip = (page - 1) * limit
        boxes = await query.skip(skip).limit(limit).to_list()
        
        return CricketBoxListResponse(
            boxes=[CricketBoxService._to_response(b) for b in boxes],
            total=total,
            page=page,
            limit=limit,
        )
    
    @staticmethod
    async def get_featured_boxes(limit: int = 5) -> CricketBoxListResponse:
        """Get featured boxes for homepage"""
        boxes = await CricketBox.find(
            CricketBox.is_active == True,
            CricketBox.is_approved == True,
            CricketBox.is_featured == True,
        ).sort(-CricketBox.rating).limit(limit).to_list()
        
        # If not enough featured, get top rated
        if len(boxes) < limit:
            additional = await CricketBox.find(
                CricketBox.is_active == True,
                CricketBox.is_approved == True,
            ).sort(-CricketBox.rating).limit(limit - len(boxes)).to_list()
            boxes.extend(additional)
        
        return CricketBoxListResponse(
            boxes=[CricketBoxService._to_response(b) for b in boxes],
            total=len(boxes),
            page=1,
            limit=limit,
        )
    
    @staticmethod
    async def get_all_areas() -> List[str]:
        """Get all unique areas"""
        boxes = await CricketBox.find(
            CricketBox.is_active == True,
            CricketBox.is_approved == True,
        ).to_list()
        
        areas = list(set(b.area for b in boxes))
        return sorted(areas)
    
    @staticmethod
    async def get_box_by_id(box_id: str) -> CricketBoxResponse:
        """Get box details by ID"""
        box = await CricketBox.get(box_id)
        
        if not box:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cricket box not found"
            )
        
        return CricketBoxService._to_response(box)
    
    @staticmethod
    async def create_box(
        owner_id: str, 
        request: CricketBoxCreate
    ) -> CricketBoxResponse:
        """Create a new cricket box"""
        owner = await User.get(owner_id)
        
        if not owner:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Owner not found"
            )
        
        # Update user role to owner if not already
        if owner.role == UserRole.PLAYER:
            owner.role = UserRole.OWNER
            await owner.save()
        
        box = CricketBox(
            **request.model_dump(),
            owner_id=owner_id,
            owner_name=owner.name,
            owner_phone=owner.phone,
            is_approved=False,  # Needs admin approval
        )
        
        await box.insert()
        
        return CricketBoxService._to_response(box)
    
    @staticmethod
    async def update_box(
        box_id: str,
        owner_id: str,
        request: CricketBoxUpdate
    ) -> CricketBoxResponse:
        """Update cricket box details"""
        box = await CricketBox.get(box_id)
        
        if not box:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cricket box not found"
            )
        
        if box.owner_id != owner_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own cricket box"
            )
        
        # Update fields
        update_data = request.model_dump(exclude_none=True)
        
        for field, value in update_data.items():
            setattr(box, field, value)
        
        box.updated_at = datetime.utcnow()
        await box.save()
        
        return CricketBoxService._to_response(box)
    
    @staticmethod
    async def delete_box(box_id: str, owner_id: str) -> SuccessResponse:
        """Deactivate cricket box"""
        box = await CricketBox.get(box_id)
        
        if not box:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cricket box not found"
            )
        
        if box.owner_id != owner_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own cricket box"
            )
        
        box.is_active = False
        box.updated_at = datetime.utcnow()
        await box.save()
        
        return SuccessResponse(message="Cricket box deleted successfully")
