"""
Authentication Service
Business logic for authentication operations
"""

from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, status
import random
import string

from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
)
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import (
    UserRegisterRequest,
    UserRegisterResponse,
    UserLoginRequest,
    LoginResponse,
    TokenResponse,
    OTPResponse,
    UserBasicInfo,
)
from app.schemas.common import SuccessResponse


class AuthService:
    """Authentication service class"""
    
    @staticmethod
    async def register_user(request: UserRegisterRequest) -> UserRegisterResponse:
        """
        Register a new user
        
        1. Check if email/phone already exists
        2. Hash password
        3. Create user record
        4. Send OTP for verification
        """
        # Check existing email
        existing_email = await User.find_one(User.email == request.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check existing phone
        existing_phone = await User.find_one(User.phone == request.phone)
        if existing_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already registered"
            )
        
        # Hash password
        password_hash = get_password_hash(request.password)
        
        # Generate OTP
        otp_code = ''.join(random.choices(string.digits, k=6))
        otp_expiry = datetime.utcnow() + timedelta(minutes=10)
        
        # Create user
        user = User(
            name=request.name,
            email=request.email,
            phone=request.phone,
            password_hash=password_hash,
            otp_code=otp_code,
            otp_expiry=otp_expiry,
        )
        
        await user.insert()
        
        # TODO: Send OTP via Twilio
        # await TwilioService.send_otp(request.phone, otp_code)
        
        return UserRegisterResponse(
            message="Registration successful. Please verify your phone with OTP.",
            user_id=str(user.id),
            email=user.email,
            requires_otp_verification=True,
        )
    
    @staticmethod
    async def login_user(request: UserLoginRequest) -> LoginResponse:
        """
        Login user with email and password
        
        1. Find user by email
        2. Verify password
        3. Generate tokens
        4. Update last login
        """
        # Find user
        user = await User.find_one(User.email == request.email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
        
        # Generate tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        # Update user
        user.refresh_token = refresh_token
        user.last_login = datetime.utcnow()
        await user.save()
        
        return LoginResponse(
            message="Login successful",
            user=UserBasicInfo(
                id=str(user.id),
                name=user.name,
                email=user.email,
                phone=user.phone,
                role=user.role,
                profile_photo=user.profile_photo,
                is_verified=user.is_verified,
            ),
            tokens=TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer",
                expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            )
        )
    
    @staticmethod
    async def send_otp(phone: str) -> OTPResponse:
        """
        Send OTP to phone number
        """
        user = await User.find_one(User.phone == phone)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found with this phone number"
            )
        
        # Generate new OTP
        otp_code = ''.join(random.choices(string.digits, k=6))
        otp_expiry = datetime.utcnow() + timedelta(minutes=10)
        
        user.otp_code = otp_code
        user.otp_expiry = otp_expiry
        await user.save()
        
        # TODO: Send via Twilio
        # await TwilioService.send_otp(phone, otp_code)
        
        return OTPResponse(
            message="OTP sent successfully",
            success=True
        )
    
    @staticmethod
    async def verify_otp(phone: str, otp: str) -> OTPResponse:
        """
        Verify OTP and activate account
        """
        user = await User.find_one(User.phone == phone)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check OTP
        if user.otp_code != otp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid OTP"
            )
        
        # Check expiry
        if user.otp_expiry < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP has expired"
            )
        
        # Mark as verified
        user.is_phone_verified = True
        user.is_verified = True
        user.otp_code = None
        user.otp_expiry = None
        await user.save()
        
        return OTPResponse(
            message="Phone verified successfully",
            success=True
        )
    
    @staticmethod
    async def refresh_access_token(refresh_token: str) -> TokenResponse:
        """
        Get new access token using refresh token
        """
        user_id = verify_refresh_token(refresh_token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        user = await User.get(user_id)
        
        if not user or user.refresh_token != refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # Generate new access token
        access_token = create_access_token(data={"sub": str(user.id)})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
    
    @staticmethod
    async def logout_user(user_id: str) -> SuccessResponse:
        """
        Logout user - invalidate refresh token
        """
        user = await User.get(user_id)
        
        if user:
            user.refresh_token = None
            await user.save()
        
        return SuccessResponse(message="Logged out successfully")
    
    @staticmethod
    async def send_password_reset(email: str) -> SuccessResponse:
        """
        Send password reset link to email
        """
        user = await User.find_one(User.email == email)
        
        if not user:
            # Don't reveal if email exists
            return SuccessResponse(
                message="If the email exists, a reset link has been sent"
            )
        
        # TODO: Generate reset token and send email
        
        return SuccessResponse(
            message="If the email exists, a reset link has been sent"
        )
    
    @staticmethod
    async def reset_password(token: str, new_password: str) -> SuccessResponse:
        """
        Reset password using token
        """
        # TODO: Verify reset token and update password
        
        return SuccessResponse(message="Password reset successfully")
