from django.core.management.base import BaseCommand
from django.utils import timezone
from Holidays.models import GlobalHorizonsExportEmail
from Holidays.profile_notifications import publish_export


class Command(BaseCommand):
    help = 'Republish pending participant Excel notifications whose retry time has arrived.'

    def handle(self, *args, **options):
        ids = list(GlobalHorizonsExportEmail.objects.filter(
            status='pending', next_attempt_at__lte=timezone.now()).order_by('created_at').values_list('pk', flat=True)[:100])
        for event_id in ids:
            publish_export(event_id)
        self.stdout.write(f'Pending export notifications checked: {len(ids)}')
