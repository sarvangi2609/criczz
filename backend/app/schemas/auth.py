"""
Authentication Schemas
Request/Response models for auth endpoints
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# ========== Registration ==========

class UserRegisterRequest(BaseModel):
    """User registration request"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=6, max_length=50)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Raj Patel",
                "email": "raj@example.com",
                "phone": "9876543210",
                "password": "securepassword123"
            }
        }


class UserRegisterResponse(BaseModel):
    """User registration response"""
    message: str
    user_id: str
    email: str
    requires_otp_verification: bool = True


# ========== Login ==========

class UserLoginRequest(BaseModel):
    """User login request"""
    email: EmailStr
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "raj@example.com",
                "password": "securepassword123"
            }
        }


class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class LoginResponse(BaseModel):
    """Login response with user info and tokens"""
    message: str
    user: "UserBasicInfo"
    tokens: TokenResponse


# ========== OTP ==========

class OTPSendRequest(BaseModel):
    """OTP send request"""
    phone: str = Field(..., min_length=10, max_length=15)


class OTPVerifyRequest(BaseModel):
    """OTP verification request"""
    phone: str = Field(..., min_length=10, max_length=15)
    otp: str = Field(..., min_length=4, max_length=6)


class OTPResponse(BaseModel):
    """OTP operation response"""
    message: str
    success: bool


# ========== Token Refresh ==========

class TokenRefreshRequest(BaseModel):
    """Token refresh request"""
    refresh_token: str


# ========== Password Reset ==========

class PasswordResetRequest(BaseModel):
    """Password reset request"""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation"""
    token: str
    new_password: str = Field(..., min_length=6, max_length=50)


# ========== User Info ==========

class UserBasicInfo(BaseModel):
    """Basic user information"""
    id: str
    name: str
    email: str
    phone: str
    role: str
    profile_photo: Optional[str] = None
    is_verified: bool


# Update forward reference
LoginResponse.model_rebuild()
