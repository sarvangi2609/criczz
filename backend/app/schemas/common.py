"""
Common Schemas
Shared response models used across APIs
"""

from typing import Optional, Any, List
from pydantic import BaseModel


class SuccessResponse(BaseModel):
    """Generic success response"""
    success: bool = True
    message: str


class ErrorResponse(BaseModel):
    """Generic error response"""
    success: bool = False
    message: str
    error_code: Optional[str] = None
    details: Optional[Any] = None


class PaginationParams(BaseModel):
    """Pagination parameters"""
    page: int = 1
    limit: int = 10


class PaginatedResponse(BaseModel):
    """Base paginated response"""
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool


class UploadResponse(BaseModel):
    """File upload response"""
    success: bool
    url: str
    filename: str
