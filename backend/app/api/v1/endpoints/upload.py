"""
Upload Endpoints
File/Image upload to S3
"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from typing import List

from app.schemas.common import UploadResponse
from app.services.upload_service import UploadService
from app.api.deps import get_current_user

router = APIRouter()


@router.post(
    "/image",
    response_model=UploadResponse,
    summary="Upload single image"
)
async def upload_image(
    file: UploadFile = File(...),
    folder: str = "general",  # profile, boxes, reviews
    current_user = Depends(get_current_user)
):
    """
    Upload a single image to S3.
    
    Returns the S3 URL of uploaded image.
    """
    return await UploadService.upload_image(
        file,
        folder,
        str(current_user.id)
    )


@router.post(
    "/images",
    response_model=List[UploadResponse],
    summary="Upload multiple images"
)
async def upload_multiple_images(
    files: List[UploadFile] = File(...),
    folder: str = "general",
    current_user = Depends(get_current_user)
):
    """
    Upload multiple images to S3.
    
    Maximum 10 images at a time.
    """
    if len(files) > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 10 images allowed at a time"
        )
    
    return await UploadService.upload_multiple_images(
        files,
        folder,
        str(current_user.id)
    )


@router.delete(
    "/",
    summary="Delete image"
)
async def delete_image(
    url: str,
    current_user = Depends(get_current_user)
):
    """
    Delete an image from S3.
    """
    return await UploadService.delete_image(url)
