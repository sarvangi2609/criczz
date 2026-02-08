"""
Payment Model
Stores payment transaction details
"""

from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field
from enum import Enum


class PaymentStatus(str, Enum):
    """Payment status"""
    CREATED = "created"
    AUTHORIZED = "authorized"
    CAPTURED = "captured"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentMethod(str, Enum):
    """Payment methods"""
    UPI = "upi"
    CARD = "card"
    NETBANKING = "netbanking"
    WALLET = "wallet"


class Payment(Document):
    """
    Payment document model for MongoDB
    
    Stores Razorpay payment details
    """
    
    # References
    user_id: str = Field(...)
    booking_id: str = Field(...)
    
    # Razorpay Details
    razorpay_order_id: str = Field(...)
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None
    
    # Amount
    amount: float = Field(...)  # In INR
    currency: str = Field(default="INR")
    
    # Commission Split
    platform_commission: float = Field(default=0.0)
    owner_amount: float = Field(default=0.0)
    
    # Status
    status: PaymentStatus = Field(default=PaymentStatus.CREATED)
    payment_method: Optional[PaymentMethod] = None
    
    # Error Details (if failed)
    error_code: Optional[str] = None
    error_description: Optional[str] = None
    
    # Refund Details
    refund_id: Optional[str] = None
    refund_amount: Optional[float] = None
    refunded_at: Optional[datetime] = None
    refund_reason: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    paid_at: Optional[datetime] = None
    
    class Settings:
        name = "payments"
