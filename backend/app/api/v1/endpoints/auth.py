"""
Authentication Endpoints
Register, Login, OTP, Token Refresh
"""

from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime

from app.schemas.auth import (
    UserRegisterRequest,
    UserRegisterResponse,
    UserLoginRequest,
    LoginResponse,
    TokenResponse,
    OTPSendRequest,
    OTPVerifyRequest,
    OTPResponse,
    TokenRefreshRequest,
    PasswordResetRequest,
    PasswordResetConfirm,
    UserBasicInfo,
)
from app.schemas.common import SuccessResponse, ErrorResponse
from app.services.auth_service import AuthService
from app.api.deps import get_current_user

router = APIRouter()


@router.post(
    "/register",
    response_model=UserRegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register new user"
)
async def register(request: UserRegisterRequest):
    """
    Register a new user account.
    
    - Validates email and phone uniqueness
    - Hashes password securely
    - Sends OTP for phone verification
    """
    return await AuthService.register_user(request)


@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Login user"
)
async def login(request: UserLoginRequest):
    """
    Authenticate user with email and password.
    
    Returns access and refresh tokens.
    """
    return await AuthService.login_user(request)


@router.post(
    "/send-otp",
    response_model=OTPResponse,
    summary="Send OTP"
)
async def send_otp(request: OTPSendRequest):
    """
    Send OTP to user's phone number for verification.
    """
    return await AuthService.send_otp(request.phone)


@router.post(
    "/verify-otp",
    response_model=OTPResponse,
    summary="Verify OTP"
)
async def verify_otp(request: OTPVerifyRequest):
    """
    Verify OTP and activate user account.
    """
    return await AuthService.verify_otp(request.phone, request.otp)


@router.post(
    "/refresh-token",
    response_model=TokenResponse,
    summary="Refresh access token"
)
async def refresh_token(request: TokenRefreshRequest):
    """
    Get new access token using refresh token.
    """
    return await AuthService.refresh_access_token(request.refresh_token)


@router.post(
    "/logout",
    response_model=SuccessResponse,
    summary="Logout user"
)
async def logout(current_user = Depends(get_current_user)):
    """
    Logout user - invalidate refresh token.
    """
    return await AuthService.logout_user(current_user.id)


@router.post(
    "/forgot-password",
    response_model=SuccessResponse,
    summary="Forgot password"
)
async def forgot_password(request: PasswordResetRequest):
    """
    Send password reset link to email.
    """
    return await AuthService.send_password_reset(request.email)


@router.post(
    "/reset-password",
    response_model=SuccessResponse,
    summary="Reset password"
)
async def reset_password(request: PasswordResetConfirm):
    """
    Reset password using token from email.
    """
    return await AuthService.reset_password(request.token, request.new_password)


@router.get(
    "/me",
    response_model=UserBasicInfo,
    summary="Get current user"
)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """
    Get current authenticated user's info.
    """
    return UserBasicInfo(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        phone=current_user.phone,
        role=current_user.role,
        profile_photo=current_user.profile_photo,
        is_verified=current_user.is_verified,
    )
