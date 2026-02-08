"""
Upload Service
File upload to AWS S3
"""

import uuid
from typing import List
from fastapi import UploadFile, HTTPException, status
import boto3
from botocore.exceptions import ClientError

from app.core.config import settings
from app.schemas.common import UploadResponse


class UploadService:
    """Upload service class"""
    
    ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    
    @staticmethod
    def _get_s3_client():
        """Get S3 client"""
        return boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )
    
    @staticmethod
    async def upload_image(
        file: UploadFile,
        folder: str,
        user_id: str
    ) -> UploadResponse:
        """Upload single image to S3"""
        # Validate file type
        if file.content_type not in UploadService.ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type. Allowed: JPEG, PNG, WebP, GIF"
            )
        
        # Read file content
        content = await file.read()
        
        # Validate file size
        if len(content) > UploadService.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File too large. Maximum size: 5MB"
            )
        
        # Generate unique filename
        ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        filename = f"{folder}/{user_id}/{uuid.uuid4().hex}.{ext}"
        
        try:
            s3_client = UploadService._get_s3_client()
            
            s3_client.put_object(
                Bucket=settings.S3_BUCKET_NAME,
                Key=filename,
                Body=content,
                ContentType=file.content_type,
                ACL="public-read",
            )
            
            url = f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{filename}"
            
            return UploadResponse(
                success=True,
                url=url,
                filename=filename,
            )
            
        except ClientError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Upload failed: {str(e)}"
            )
    
    @staticmethod
    async def upload_multiple_images(
        files: List[UploadFile],
        folder: str,
        user_id: str
    ) -> List[UploadResponse]:
        """Upload multiple images to S3"""
        results = []
        
        for file in files:
            result = await UploadService.upload_image(file, folder, user_id)
            results.append(result)
        
        return results
    
    @staticmethod
    async def delete_image(url: str) -> dict:
        """Delete image from S3"""
        try:
            # Extract key from URL
            key = url.split(f"{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/")[1]
            
            s3_client = UploadService._get_s3_client()
            
            s3_client.delete_object(
                Bucket=settings.S3_BUCKET_NAME,
                Key=key,
            )
            
            return {"success": True, "message": "Image deleted"}
            
        except Exception as e:
            return {"success": False, "message": str(e)}
