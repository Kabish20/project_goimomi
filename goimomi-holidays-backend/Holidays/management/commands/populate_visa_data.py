from django.core.management.base import BaseCommand
from Holidays.models import Visa

class Command(BaseCommand):
    help = 'Populate visa data for Vietnam'

    def handle(self, *args, **kwargs):
        # Clear existing Vietnam visas to avoid duplicates
        Visa.objects.filter(country="Vietnam").delete()

        visas = [
            {
                "country": "Vietnam",
                "title": "Vietnam E-Visa.",
                "entry_type": "Single",
                "validity": "30 days",
                "duration": "30 days",
                "processing_time": "3 Business Days",
                "price": 3999,
                "documents_required": "Passport Front, Photo",
            },
            {
                "country": "Vietnam",
                "title": "Lighting Fast (6 Business Hours - Apply Before 11:30 AM)",
                "entry_type": "Single",
                "validity": "30 days",
                "duration": "30 days",
                "processing_time": "6 Business Hours",
                "price": 8999,
                "documents_required": "Passport Front, Photo",
            },
            {
                "country": "Vietnam",
                "title": "Ultra Fast Express (12 Business Hours - Apply Before 11:30 AM)",
                "entry_type": "Single",
                "validity": "30 days",
                "duration": "30 days",
                "processing_time": "12 Business Hours",
                "price": 6800,
                "documents_required": "Passport Front, Photo",
            },
            {
                "country": "Vietnam",
                "title": "Evisa Vietnam 30 Days",
                "entry_type": "Single",
                "validity": "30 days",
                "duration": "30 days",
                "processing_time": "5 Business Days",
                "price": 2549,
                "documents_required": "Passport Front, Photo",
            },
            {
                "country": "Vietnam",
                "title": "Vietnam 90 Days Multiple Entry E-Visa",
                "entry_type": "Multiple",
                "validity": "90 days",
                "duration": "90 days",
                "processing_time": "4 Business Days",
                "price": 12404,
                "documents_required": "Passport Front, Photo",
            }
        ]

        for data in visas:
            Visa.objects.create(**data)
            self.stdout.write(self.style.SUCCESS(f'Created visa: {data["title"]}'))
