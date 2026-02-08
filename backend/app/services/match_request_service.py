"""
Match Request Service
Business logic for player matching
"""

from datetime import datetime, date
from typing import Optional
from fastapi import HTTPException, status

from app.models.match_request import MatchRequest, RequestStatus, JoinRequest, JoinRequestStatus
from app.models.user import User
from app.schemas.match_request import (
    MatchRequestCreate,
    MatchRequestUpdate,
    MatchRequestResponse,
    MatchRequestListResponse,
    JoinRequestCreate,
    JoinRequestResponse,
)
from app.schemas.common import SuccessResponse
from app.services.notification_service import NotificationService


class MatchRequestService:
    """Match request service class"""
    
    @staticmethod
    def _to_response(req: MatchRequest) -> MatchRequestResponse:
        """Convert model to response"""
        return MatchRequestResponse(
            id=str(req.id),
            creator_id=req.creator_id,
            creator_name=req.creator_name,
            creator_photo=req.creator_photo,
            creator_skill_level=req.creator_skill_level,
            title=req.title,
            description=req.description,
            match_date=req.match_date,
            preferred_time=req.preferred_time,
            start_time=req.start_time,
            end_time=req.end_time,
            preferred_area=req.preferred_area,
            cricket_box_id=req.cricket_box_id,
            cricket_box_name=req.cricket_box_name,
            players_needed=req.players_needed,
            players_joined=req.players_joined,
            skill_level_required=req.skill_level_required,
            status=req.status,
            join_requests=[
                JoinRequestResponse(
                    user_id=jr.user_id,
                    user_name=jr.user_name,
                    user_photo=jr.user_photo,
                    skill_level=jr.skill_level,
                    message=jr.message,
                    status=jr.status,
                    requested_at=jr.requested_at,
                )
                for jr in req.join_requests
            ],
            accepted_players=req.accepted_players,
            chat_room_id=req.chat_room_id,
            created_at=req.created_at,
        )
    
    @staticmethod
    async def list_requests(
        area: Optional[str] = None,
        match_date: Optional[date] = None,
        skill_level: Optional[str] = None,
        status: str = "open",
        page: int = 1,
        limit: int = 10,
    ) -> MatchRequestListResponse:
        """List match requests with filters"""
        query = MatchRequest.find(MatchRequest.status == status)
        
        if area:
            query = query.find(MatchRequest.preferred_area == area)
        
        if match_date:
            query = query.find(MatchRequest.match_date == match_date)
        
        if skill_level:
            query = query.find(MatchRequest.skill_level_required == skill_level)
        
        total = await query.count()
        
        skip = (page - 1) * limit
        requests = await query.sort(-MatchRequest.created_at).skip(skip).limit(limit).to_list()
        
        return MatchRequestListResponse(
            requests=[MatchRequestService._to_response(r) for r in requests],
            total=total,
            page=page,
            limit=limit,
        )
    
    @staticmethod
    async def create_request(
        user_id: str,
        request: MatchRequestCreate
    ) -> MatchRequestResponse:
        """Create new match request"""
        user = await User.get(user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        match_req = MatchRequest(
            creator_id=user_id,
            creator_name=user.name,
            creator_photo=user.profile_photo,
            creator_skill_level=user.skill_level,
            title=request.title,
            description=request.description,
            match_date=request.match_date,
            preferred_time=request.preferred_time,
            start_time=request.start_time,
            end_time=request.end_time,
            preferred_area=request.preferred_area,
            cricket_box_id=request.cricket_box_id,
            players_needed=request.players_needed,
            skill_level_required=request.skill_level_required,
            status=RequestStatus.OPEN,
        )
        
        await match_req.insert()
        
        return MatchRequestService._to_response(match_req)
    
    @staticmethod
    async def get_request_by_id(request_id: str) -> MatchRequestResponse:
        """Get match request details"""
        req = await MatchRequest.get(request_id)
        
        if not req:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match request not found"
            )
        
        return MatchRequestService._to_response(req)
    
    @staticmethod
    async def get_user_requests(
        user_id: str,
        status: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
    ) -> MatchRequestListResponse:
        """Get user's created match requests"""
        query = MatchRequest.find(MatchRequest.creator_id == user_id)
        
        if status:
            query = query.find(MatchRequest.status == status)
        
        total = await query.count()
        
        skip = (page - 1) * limit
        requests = await query.sort(-MatchRequest.created_at).skip(skip).limit(limit).to_list()
        
        return MatchRequestListResponse(
            requests=[MatchRequestService._to_response(r) for r in requests],
            total=total,
            page=page,
            limit=limit,
        )
    
    @staticmethod
    async def get_user_joined_requests(
        user_id: str,
        status: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
    ) -> MatchRequestListResponse:
        """Get requests where user has joined or is accepted"""
        # Find requests where user is in join_requests or accepted_players
        all_requests = await MatchRequest.find().to_list()
        
        user_requests = [
            r for r in all_requests
            if user_id in r.accepted_players 
            or any(jr.user_id == user_id for jr in r.join_requests)
        ]
        
        if status:
            user_requests = [r for r in user_requests if r.status == status]
        
        total = len(user_requests)
        
        skip = (page - 1) * limit
        paginated = user_requests[skip:skip + limit]
        
        return MatchRequestListResponse(
            requests=[MatchRequestService._to_response(r) for r in paginated],
            total=total,
            page=page,
            limit=limit,
        )
    
    @staticmethod
    async def update_request(
        request_id: str,
        user_id: str,
        request: MatchRequestUpdate
    ) -> MatchRequestResponse:
        """Update match request"""
        req = await MatchRequest.get(request_id)
        
        if not req:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match request not found"
            )
        
        if req.creator_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own requests"
            )
        
        update_data = request.model_dump(exclude_none=True)
        
        for field, value in update_data.items():
            setattr(req, field, value)
        
        req.updated_at = datetime.utcnow()
        await req.save()
        
        return MatchRequestService._to_response(req)
    
    @staticmethod
    async def delete_request(
        request_id: str,
        user_id: str
    ) -> SuccessResponse:
        """Delete/cancel match request"""
        req = await MatchRequest.get(request_id)
        
        if not req:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match request not found"
            )
        
        if req.creator_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own requests"
            )
        
        req.status = RequestStatus.CANCELLED
        req.updated_at = datetime.utcnow()
        await req.save()
        
        return SuccessResponse(message="Match request cancelled")
    
    @staticmethod
    async def send_join_request(
        request_id: str,
        user_id: str,
        request: JoinRequestCreate
    ) -> SuccessResponse:
        """Send join request to a match"""
        req = await MatchRequest.get(request_id)
        
        if not req:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match request not found"
            )
        
        if req.status != RequestStatus.OPEN:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This match request is no longer accepting players"
            )
        
        if req.creator_id == user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot join your own request"
            )
        
        # Check if already requested
        if any(jr.user_id == user_id for jr in req.join_requests):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already requested to join"
            )
        
        user = await User.get(user_id)
        
        join_req = JoinRequest(
            user_id=user_id,
            user_name=user.name,
            user_photo=user.profile_photo,
            skill_level=user.skill_level,
            message=request.message,
            status=JoinRequestStatus.PENDING,
        )
        
        req.join_requests.append(join_req)
        req.updated_at = datetime.utcnow()
        await req.save()
        
        # Send notification to creator
        await NotificationService.send_match_request_notification(
            user_id=req.creator_id,
            title="New Join Request",
            message=f"{user.name} wants to join your match!",
            request_id=request_id,
        )
        
        return SuccessResponse(message="Join request sent successfully")
    
    @staticmethod
    async def accept_join_request(
        request_id: str,
        creator_id: str,
        user_id: str
    ) -> SuccessResponse:
        """Accept a player's join request"""
        req = await MatchRequest.get(request_id)
        
        if not req:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match request not found"
            )
        
        if req.creator_id != creator_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the creator can accept join requests"
            )
        
        # Find and update join request
        join_req = next((jr for jr in req.join_requests if jr.user_id == user_id), None)
        
        if not join_req:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Join request not found"
            )
        
        join_req.status = JoinRequestStatus.ACCEPTED
        join_req.responded_at = datetime.utcnow()
        
        # Add to accepted players
        if user_id not in req.accepted_players:
            req.accepted_players.append(user_id)
            req.players_joined += 1
        
        # Check if team is complete
        if req.players_joined >= req.players_needed:
            req.status = RequestStatus.CLOSED
        
        req.updated_at = datetime.utcnow()
        await req.save()
        
        # Send notification to accepted player
        await NotificationService.send_match_request_notification(
            user_id=user_id,
            title="Request Accepted! 🎉",
            message=f"You've been accepted to join {req.creator_name}'s match!",
            request_id=request_id,
        )
        
        return SuccessResponse(message="Player accepted successfully")
    
    @staticmethod
    async def reject_join_request(
        request_id: str,
        creator_id: str,
        user_id: str
    ) -> SuccessResponse:
        """Reject a player's join request"""
        req = await MatchRequest.get(request_id)
        
        if not req:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match request not found"
            )
        
        if req.creator_id != creator_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the creator can reject join requests"
            )
        
        join_req = next((jr for jr in req.join_requests if jr.user_id == user_id), None)
        
        if not join_req:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Join request not found"
            )
        
        join_req.status = JoinRequestStatus.REJECTED
        join_req.responded_at = datetime.utcnow()
        
        req.updated_at = datetime.utcnow()
        await req.save()
        
        return SuccessResponse(message="Player rejected")
    
    @staticmethod
    async def withdraw_join_request(
        request_id: str,
        user_id: str
    ) -> SuccessResponse:
        """Withdraw own join request"""
        req = await MatchRequest.get(request_id)
        
        if not req:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match request not found"
            )
        
        req.join_requests = [jr for jr in req.join_requests if jr.user_id != user_id]
        
        if user_id in req.accepted_players:
            req.accepted_players.remove(user_id)
            req.players_joined -= 1
        
        req.updated_at = datetime.utcnow()
        await req.save()
        
        return SuccessResponse(message="Join request withdrawn")
