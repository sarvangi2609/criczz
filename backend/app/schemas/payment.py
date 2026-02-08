"""
Payment Schemas
Request/Response models for payment endpoints
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class PaymentOrderCreate(BaseModel):
    """Create payment order"""
    booking_id: str
    amount: float


class PaymentOrderResponse(BaseModel):
    """Payment order response"""
    order_id: str
    amount: float
    currency: str
    booking_id: str
    razorpay_key_id: str


class PaymentVerifyRequest(BaseModel):
    """Verify payment request"""
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class PaymentVerifyResponse(BaseModel):
    """Payment verification response"""
    success: bool
    message: str
    booking_id: Optional[str] = None
    payment_id: Optional[str] = None


class PaymentResponse(BaseModel):
    """Payment details response"""
    id: str
    user_id: str
    booking_id: str
    razorpay_order_id: str
    razorpay_payment_id: Optional[str] = None
    amount: float
    currency: str
    status: str
    payment_method: Optional[str] = None
    created_at: datetime
    paid_at: Optional[datetime] = None


class RefundRequest(BaseModel):
    """Refund request"""
    payment_id: str
    amount: Optional[float] = None  # Partial refund
    reason: str


class RefundResponse(BaseModel):
    """Refund response"""
    success: bool
    message: str
    refund_id: Optional[str] = None
    refund_amount: Optional[float] = None
