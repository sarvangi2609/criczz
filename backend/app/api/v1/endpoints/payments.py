"""
Payment Endpoints
Razorpay integration
"""

from fastapi import APIRouter, HTTPException, Depends, Request, status

from app.schemas.payment import (
    PaymentOrderCreate,
    PaymentOrderResponse,
    PaymentVerifyRequest,
    PaymentVerifyResponse,
    PaymentResponse,
    RefundRequest,
    RefundResponse,
)
from app.schemas.common import SuccessResponse
from app.services.payment_service import PaymentService
from app.api.deps import get_current_user

router = APIRouter()


@router.post(
    "/create-order",
    response_model=PaymentOrderResponse,
    summary="Create payment order"
)
async def create_payment_order(
    request: PaymentOrderCreate,
    current_user = Depends(get_current_user)
):
    """
    Create a Razorpay payment order.
    
    - Creates order with Razorpay
    - Returns order ID and amount
    """
    return await PaymentService.create_order(
        str(current_user.id),
        request
    )


@router.post(
    "/verify",
    response_model=PaymentVerifyResponse,
    summary="Verify payment"
)
async def verify_payment(
    request: PaymentVerifyRequest,
    current_user = Depends(get_current_user)
):
    """
    Verify Razorpay payment signature.
    
    - Validates payment signature
    - Confirms booking on success
    - Sends notifications
    """
    return await PaymentService.verify_payment(
        str(current_user.id),
        request
    )


@router.get(
    "/{payment_id}",
    response_model=PaymentResponse,
    summary="Get payment details"
)
async def get_payment(
    payment_id: str,
    current_user = Depends(get_current_user)
):
    """
    Get payment details by ID.
    """
    return await PaymentService.get_payment(
        payment_id,
        str(current_user.id)
    )


@router.post(
    "/webhook",
    summary="Razorpay webhook"
)
async def razorpay_webhook(request: Request):
    """
    Razorpay webhook endpoint.
    
    Handles:
    - payment.captured
    - payment.failed
    - refund.processed
    """
    return await PaymentService.handle_webhook(request)


@router.post(
    "/refund",
    response_model=RefundResponse,
    summary="Request refund"
)
async def request_refund(
    request: RefundRequest,
    current_user = Depends(get_current_user)
):
    """
    Request a refund for a payment.
    """
    return await PaymentService.process_refund(
        str(current_user.id),
        request
    )
