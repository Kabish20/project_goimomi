"""Queue full participant exports after committed profile changes."""
import logging
from datetime import timedelta
from types import SimpleNamespace
from urllib.parse import urljoin

from django.conf import settings
from django.core.mail import EmailMessage
from django.db import transaction
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone

from .models import GlobalHorizonsProfile, GlobalHorizonsExportEmail

logger = logging.getLogger(__name__)
DOCUMENT_FIELDS = {'attending_poster', 'attending_poster_image', 'profile_booklet'}


def publish_export(event_id):
    from .tasks import send_global_horizons_export_task
    try:
        send_global_horizons_export_task.apply_async(args=[event_id], queue='enquiries', retry=False)
    except Exception as error:
        # The recovery timer republishes pending records after a broker outage.
        logger.error('Export email %s remains pending: %s', event_id, type(error).__name__)


def queue_profile_export(event, profile_id=None, using='default'):
    recipients = list(dict.fromkeys(settings.GLOBAL_HORIZONS_EXPORT_RECIPIENTS))
    if not recipients:
        return None
    delivery = GlobalHorizonsExportEmail.objects.using(using).create(
        event=event, profile_id=profile_id, recipients=recipients)
    transaction.on_commit(lambda: publish_export(delivery.pk), using=using)
    return delivery


@receiver(post_save, sender=GlobalHorizonsProfile, dispatch_uid='global_horizons_export_save')
def profile_saved(sender, instance, created, raw=False, using='default', update_fields=None, **kwargs):
    if raw or (update_fields and set(update_fields) <= DOCUMENT_FIELDS):
        return
    queue_profile_export('created' if created else 'updated', instance.pk, using)


@receiver(post_delete, sender=GlobalHorizonsProfile, dispatch_uid='global_horizons_export_delete')
def profile_deleted(sender, instance, using='default', **kwargs):
    queue_profile_export('deleted', instance.pk, using)


def deliver_profile_export(event_id):
    from .profile_exports import export_profiles
    with transaction.atomic():
        delivery = GlobalHorizonsExportEmail.objects.select_for_update().get(pk=event_id)
        if delivery.status != 'pending' or delivery.next_attempt_at > timezone.now():
            return delivery.status == 'sent'
        delivery.attempts += 1
        try:
            profiles = list(GlobalHorizonsProfile.objects.all())
            request = SimpleNamespace(build_absolute_uri=lambda path: urljoin(settings.GLOBAL_HORIZONS_PUBLIC_URL, path))
            attachment = export_profiles(profiles, request, 'xlsx').content
            message = EmailMessage(
                subject=f'Global Horizons Sri Lanka | Full participant Excel | {delivery.event} #{delivery.pk}',
                body=(f'A participant profile was {delivery.event}.\n\n'
                      f'Attached is the full current participant list ({len(profiles)} profiles), '
                      'including profile details, flight information and document links.\n'
                      f'Generated: {timezone.now():%Y-%m-%d %H:%M} UTC.\n'
                      'This report contains participant information intended for the configured organisers.'),
                from_email=settings.DEFAULT_FROM_EMAIL, to=delivery.recipients[:1],
                bcc=delivery.recipients[1:],
                cc=[address for address in settings.GLOBAL_HORIZONS_EXPORT_CC
                    if address.lower() not in {recipient.lower() for recipient in delivery.recipients}])
            message.attach(f'global-horizons-full-{delivery.pk}.xlsx', attachment,
                           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            if message.send(fail_silently=False) != 1:
                raise RuntimeError('Mail backend did not accept the message')
            delivery.status = 'sent'
            delivery.sent_at = timezone.now()
            delivery.last_error = ''
        except Exception as error:
            delivery.last_error = type(error).__name__
            delivery.status = 'failed' if delivery.attempts >= 5 else 'pending'
            delivery.next_attempt_at = timezone.now() + timedelta(seconds=60 * 2 ** (delivery.attempts - 1))
            logger.error('Export email %s attempt %s: %s', delivery.pk, delivery.attempts, delivery.last_error)
        delivery.save()
        return delivery.status == 'sent'
