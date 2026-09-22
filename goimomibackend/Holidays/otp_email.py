import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from rest_framework.response import Response

from .models import OTPVerification

logger = logging.getLogger(__name__)


def deliver_otp(email, otp, subject, message, html_message):
    """Report success only after the SMTP server accepts the message."""
    try:
        mail = EmailMultiAlternatives(subject, message, settings.DEFAULT_FROM_EMAIL, [email])
        mail.attach_alternative(html_message, 'text/html')
        if mail.send(fail_silently=False) != 1:
            raise RuntimeError('Mail backend did not accept the message')
    except Exception as error:
        # Do not remove a newer code created by a concurrent resend request.
        OTPVerification.objects.filter(email=email, otp=otp, is_verified=False).delete()
        logger.error('OTP delivery failed: %s (SMTP code %s)', type(error).__name__,
                     getattr(error, 'smtp_code', 'unavailable'))
        return Response({'error': 'We could not send your verification email. Please try again shortly or contact support.'}, status=503)
    return Response({'message': 'Verification email accepted for delivery. Please check your inbox and spam folder.'}, status=200)
