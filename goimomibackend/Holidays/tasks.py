import logging
from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(soft_time_limit=90, time_limit=120)
def send_global_horizons_export_task(event_id):
    from .profile_notifications import deliver_profile_export
    return deliver_profile_export(event_id)


def queue_enquiry_notifications(enquiry, enquiry_type, lead_data):
    """Publish after commit; an unavailable notification service cannot reject a saved lead."""
    from django.db import transaction

    def publish():
        jobs = (
            (send_enquiry_email_task, [enquiry._meta.label, enquiry.pk, enquiry_type]),
            (sync_enquiry_crm_task, [lead_data]),
        )
        for task, args in jobs:
            try:
                task.apply_async(args=args, retry=False, queue='enquiries')
            except Exception:
                logger.exception('Could not queue %s for saved enquiry %s:%s',
                                 task.name, enquiry._meta.label, enquiry.pk)

    transaction.on_commit(publish)


@shared_task(bind=True, max_retries=3, default_retry_delay=60, soft_time_limit=45, time_limit=60)
def send_enquiry_email_task(self, model_label, enquiry_pk, enquiry_type):
    from django.apps import apps
    from Holidays.utils import send_enquiry_email
    model = apps.get_model(model_label)
    enquiry = model.objects.filter(pk=enquiry_pk).first()
    if enquiry is None:
        return False
    if not send_enquiry_email(enquiry, enquiry_type):
        raise self.retry(exc=RuntimeError('Enquiry email delivery failed'))
    return True


@shared_task(bind=True, max_retries=3, default_retry_delay=60, soft_time_limit=60, time_limit=75)
def sync_enquiry_crm_task(self, lead_data):
    from Holidays.utils import create_zoho_crm_lead
    result = create_zoho_crm_lead(lead_data)
    if not result.get('success'):
        raise self.retry(exc=RuntimeError('CRM enquiry synchronization failed'))
    return True

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
            raise RuntimeError('Order email was not accepted for delivery')
        return success
    except GoimomiProductOrder.DoesNotExist:
        logger.error(f"[Celery] Order with pk={order_pk} does not exist.")
        return False
    except Exception as exc:
        logger.error(f"[Celery] Error sending product order email: {exc}")
        raise self.retry(exc=exc)

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
            raise RuntimeError('Shipping email was not accepted for delivery')
        return success
    except GoimomiProductOrder.DoesNotExist:
        logger.error(f"[Celery] Order with pk={order_pk} does not exist.")
        return False
    except Exception as exc:
        logger.error(f"[Celery] Error sending product shipped email: {exc}")
        raise self.retry(exc=exc)

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_product_delivered_email_task(self, order_pk):
    """
    Celery task to send product delivery confirmation email asynchronously.
    """
    try:
        from Holidays.models import GoimomiProductOrder
        from Holidays.utils import send_product_delivered_email

        order = GoimomiProductOrder.objects.get(pk=order_pk)
        success = send_product_delivered_email(order)
        if not success:
            raise RuntimeError('Delivered email was not accepted for delivery')
        return success
    except GoimomiProductOrder.DoesNotExist:
        logger.error(f"[Celery] Order with pk={order_pk} does not exist.")
        return False
    except Exception as exc:
        logger.error(f"[Celery] Error sending product delivered email: {exc}")
        raise self.retry(exc=exc)

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_product_cancelled_email_task(self, order_pk):
    """
    Celery task to send product order cancellation email asynchronously.
    """
    try:
        from Holidays.models import GoimomiProductOrder
        from Holidays.utils import send_product_cancelled_email

        order = GoimomiProductOrder.objects.get(pk=order_pk)
        success = send_product_cancelled_email(order)
        if not success:
            raise RuntimeError('Cancelled email was not accepted for delivery')
        return success
    except GoimomiProductOrder.DoesNotExist:
        logger.error(f"[Celery] Order with pk={order_pk} does not exist.")
        return False
    except Exception as exc:
        logger.error(f"[Celery] Error sending product cancelled email: {exc}")
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
            raise RuntimeError('Cab voucher email was not accepted for delivery')
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
