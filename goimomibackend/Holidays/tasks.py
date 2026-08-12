import logging
from celery import shared_task

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_product_order_email_task(self, order_pk):
    """
    Celery task to send product order confirmation email asynchronously.
    """
    try:
        from Holidays.models import GoimomiProductOrder
        from Holidays.utils import send_product_order_email

        order = GoimomiProductOrder.objects.get(pk=order_pk)
        success = send_product_order_email(order)
        if not success:
            logger.warning(f"[Celery] Order email attempt returned False for order_pk={order_pk}")
        return success
    except GoimomiProductOrder.DoesNotExist:
        logger.error(f"[Celery] Order with pk={order_pk} does not exist.")
        return False
@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_product_shipped_email_task(self, order_pk):
    """
    Celery task to send product shipping dispatch email asynchronously.
    """
    try:
        from Holidays.models import GoimomiProductOrder
        from Holidays.utils import send_product_shipped_email

        order = GoimomiProductOrder.objects.get(pk=order_pk)
        success = send_product_shipped_email(order)
        if not success:
            logger.warning(f"[Celery] Shipping email attempt returned False for order_pk={order_pk}")
        return success
    except GoimomiProductOrder.DoesNotExist:
        logger.error(f"[Celery] Order with pk={order_pk} does not exist.")
        return False
    except Exception as exc:
        logger.error(f"[Celery] Error sending product shipped email: {exc}")
        raise self.retry(exc=exc)



@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_cab_booking_email_task(self, booking_pk):
    """
    Celery task to send cab booking voucher & invoice email asynchronously.
    """
    try:
        from Holidays.models import CabBooking
        from Holidays.utils import send_booking_voucher

        booking = CabBooking.objects.get(pk=booking_pk)
        success = send_booking_voucher(booking)
        if not success:
            logger.warning(f"[Celery] Cab voucher email attempt returned False for booking_pk={booking_pk}")
        return success
    except CabBooking.DoesNotExist:
        logger.error(f"[Celery] Booking with pk={booking_pk} does not exist.")
        return False
    except Exception as exc:
        logger.error(f"[Celery] Error sending cab booking email: {exc}")
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=2, default_retry_delay=30)
def send_otp_email_task(self, email, otp, subject="Verification Code - Goimomi"):
    """
    Celery task to send OTP email asynchronously.
    """
    try:
        from django.core.mail import EmailMultiAlternatives
        from django.conf import settings

        message = f"Hello,\n\nYour OTP verification code is: {otp}\n\nThis code will expire in 5 minutes.\n\nBest regards,\nGoimomi Team"
        html_message = f"""
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <p>Hello,</p>
            <p>Your verification code is:</p>
            <div style="font-size: 28px; font-weight: bold; background: #f0fdf4; padding: 12px; text-align: center; font-family: monospace; border-radius: 6px;">
                {otp}
            </div>
            <p style="color: #666; font-size: 13px; margin-top: 16px;">This code is valid for 5 minutes.</p>
        </div>
        """
        sender = getattr(settings, 'DEFAULT_FROM_EMAIL', 'support@goimomi.com')
        msg = EmailMultiAlternatives(
            subject=subject,
            body=message,
            from_email=sender,
            to=[email]
        )
        msg.attach_alternative(html_message, "text/html")
        msg.send(fail_silently=True)
        return True
    except Exception as exc:
        logger.error(f"[Celery] Error sending OTP email to {email}: {exc}")
        raise self.retry(exc=exc)


@shared_task
def cleanup_or_sync_pending_orders_task():
    """
    Celery Beat scheduled task running every 5 minutes.
    """
    try:
        from django.utils import timezone
        from datetime import timedelta
        from Holidays.models import GoimomiProductOrder

        # Find old unverified pending orders older than 24 hours
        cutoff = timezone.now() - timedelta(hours=24)
        expired = GoimomiProductOrder.objects.filter(status='Pending', created_at__lt=cutoff)
        count = expired.count()
        logger.info(f"[Celery Beat] Cleaned up / checked {count} pending expired orders.")
        return count
    except Exception as e:
        logger.error(f"[Celery Beat] Error in cleanup task: {e}")
        return 0
