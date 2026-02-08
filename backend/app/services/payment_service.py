"""
Payment Service
Razorpay payment integration
"""

from datetime import datetime
from typing import Optional
from fastapi import HTTPException, Request, status
import razorpay
import hmac
import hashlib

from app.core.config import settings
from app.models.payment import Payment, PaymentStatus, PaymentMethod
from app.models.booking import Booking, BookingStatus
from app.models.booking import PaymentStatus as BookingPaymentStatus
from app.schemas.payment import (
    PaymentOrderCreate,
    PaymentOrderResponse,
    PaymentVerifyRequest,
    PaymentVerifyResponse,
    PaymentResponse,
    RefundRequest,
    RefundResponse,
)
from app.services.notification_service import NotificationService


class PaymentService:
    """Payment service class"""
    
    @staticmethod
    def _get_razorpay_client():
        """Get Razorpay client instance"""
        return razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
    
    @staticmethod
    async def create_order(
        user_id: str,
        request: PaymentOrderCreate
    ) -> PaymentOrderResponse:
        """Create Razorpay order"""
        # Get booking
        booking = await Booking.get(request.booking_id)
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        if booking.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        if booking.payment_status == BookingPaymentStatus.PAID:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Booking already paid"
            )
        
        # Create Razorpay order
        client = PaymentService._get_razorpay_client()
        
        amount_in_paise = int(booking.total_amount * 100)
        
        order_data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": booking.booking_number,
            "notes": {
                "booking_id": str(booking.id),
                "user_id": user_id,
            }
        }
        
        razorpay_order = client.order.create(data=order_data)
        
        # Calculate commission split
        platform_commission = booking.platform_fee
        owner_amount = booking.total_amount - platform_commission
        
        # Create payment record
        payment = Payment(
            user_id=user_id,
            booking_id=str(booking.id),
            razorpay_order_id=razorpay_order["id"],
            amount=booking.total_amount,
            platform_commission=platform_commission,
            owner_amount=owner_amount,
            status=PaymentStatus.CREATED,
        )
        
        await payment.insert()
        
        # Update booking with order ID
        booking.payment_order_id = razorpay_order["id"]
        await booking.save()
        
        return PaymentOrderResponse(
            order_id=razorpay_order["id"],
            amount=booking.total_amount,
            currency="INR",
            booking_id=str(booking.id),
            razorpay_key_id=settings.RAZORPAY_KEY_ID,
        )
    
    @staticmethod
    async def verify_payment(
        user_id: str,
        request: PaymentVerifyRequest
    ) -> PaymentVerifyResponse:
        """Verify Razorpay payment signature"""
        # Find payment
        payment = await Payment.find_one(
            Payment.razorpay_order_id == request.razorpay_order_id
        )
        
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        if payment.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Verify signature
        message = f"{request.razorpay_order_id}|{request.razorpay_payment_id}"
        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature != request.razorpay_signature:
            # Payment failed
            payment.status = PaymentStatus.FAILED
            payment.error_description = "Invalid payment signature"
            await payment.save()
            
            return PaymentVerifyResponse(
                success=False,
                message="Payment verification failed",
            )
        
        # Payment successful
        payment.razorpay_payment_id = request.razorpay_payment_id
        payment.razorpay_signature = request.razorpay_signature
        payment.status = PaymentStatus.CAPTURED
        payment.paid_at = datetime.utcnow()
        payment.updated_at = datetime.utcnow()
        await payment.save()
        
        # Update booking
        booking = await Booking.get(payment.booking_id)
        
        if booking:
            booking.payment_status = BookingPaymentStatus.PAID
            booking.payment_id = request.razorpay_payment_id
            booking.booking_status = BookingStatus.CONFIRMED
            booking.paid_at = datetime.utcnow()
            booking.updated_at = datetime.utcnow()
            await booking.save()
            
            # Send notification to user
            await NotificationService.send_booking_notification(
                user_id=booking.user_id,
                booking_id=str(booking.id),
                title="Booking Confirmed! 🎉",
                message=f"Your booking at {booking.cricket_box_name} is confirmed!",
            )
            
            # Send notification to owner
            await NotificationService.send_booking_notification(
                user_id=booking.owner_id,
                booking_id=str(booking.id),
                title="New Booking! 📅",
                message=f"New booking for {booking.booking_date} at {booking.start_time}",
            )
        
        return PaymentVerifyResponse(
            success=True,
            message="Payment verified successfully",
            booking_id=payment.booking_id,
            payment_id=str(payment.id),
        )
    
    @staticmethod
    async def get_payment(
        payment_id: str,
        user_id: str
    ) -> PaymentResponse:
        """Get payment details"""
        payment = await Payment.get(payment_id)
        
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        if payment.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        return PaymentResponse(
            id=str(payment.id),
            user_id=payment.user_id,
            booking_id=payment.booking_id,
            razorpay_order_id=payment.razorpay_order_id,
            razorpay_payment_id=payment.razorpay_payment_id,
            amount=payment.amount,
            currency=payment.currency,
            status=payment.status,
            payment_method=payment.payment_method,
            created_at=payment.created_at,
            paid_at=payment.paid_at,
        )
    
    @staticmethod
    async def handle_webhook(request: Request):
        """Handle Razorpay webhook"""
        body = await request.body()
        signature = request.headers.get("X-Razorpay-Signature", "")
        
        # Verify webhook signature
        expected_signature = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode(),
            body,
            hashlib.sha256
        ).hexdigest()
        
        if signature != expected_signature:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid webhook signature"
            )
        
        data = await request.json()
        event = data.get("event")
        
        if event == "payment.captured":
            # Payment successful - already handled in verify
            pass
        
        elif event == "payment.failed":
            payload = data.get("payload", {}).get("payment", {}).get("entity", {})
            order_id = payload.get("order_id")
            
            payment = await Payment.find_one(
                Payment.razorpay_order_id == order_id
            )
            
            if payment:
                payment.status = PaymentStatus.FAILED
                payment.error_code = payload.get("error_code")
                payment.error_description = payload.get("error_description")
                await payment.save()
        
        elif event == "refund.processed":
            payload = data.get("payload", {}).get("refund", {}).get("entity", {})
            payment_id = payload.get("payment_id")
            
            payment = await Payment.find_one(
                Payment.razorpay_payment_id == payment_id
            )
            
            if payment:
                payment.status = PaymentStatus.REFUNDED
                payment.refund_id = payload.get("id")
                payment.refund_amount = payload.get("amount") / 100
                payment.refunded_at = datetime.utcnow()
                await payment.save()
        
        return {"status": "ok"}
    
    @staticmethod
    async def process_refund(
        user_id: str,
        request: RefundRequest
    ) -> RefundResponse:
        """Process refund request"""
        payment = await Payment.get(request.payment_id)
        
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        if payment.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        if payment.status != PaymentStatus.CAPTURED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment cannot be refunded"
            )
        
        # Process refund via Razorpay
        client = PaymentService._get_razorpay_client()
        
        refund_amount = request.amount or payment.amount
        refund_amount_paise = int(refund_amount * 100)
        
        try:
            refund = client.payment.refund(
                payment.razorpay_payment_id,
                {
                    "amount": refund_amount_paise,
                    "notes": {"reason": request.reason}
                }
            )
            
            payment.status = PaymentStatus.REFUNDED
            payment.refund_id = refund["id"]
            payment.refund_amount = refund_amount
            payment.refund_reason = request.reason
            payment.refunded_at = datetime.utcnow()
            await payment.save()
            
            return RefundResponse(
                success=True,
                message="Refund processed successfully",
                refund_id=refund["id"],
                refund_amount=refund_amount,
            )
            
        except Exception as e:
            return RefundResponse(
                success=False,
                message=f"Refund failed: {str(e)}",
            )
