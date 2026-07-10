import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.conf import settings
from Holidays.services.zoho_payment import ZohoPaymentService

print("ZOHO_PAYMENTS_CLIENT_ID:", getattr(settings, 'ZOHO_PAYMENTS_CLIENT_ID', ''))
print("ZOHO_PAYMENTS_CLIENT_SECRET:", getattr(settings, 'ZOHO_PAYMENTS_CLIENT_SECRET', ''))
print("ZOHO_PAYMENTS_REFRESH_TOKEN:", getattr(settings, 'ZOHO_PAYMENTS_REFRESH_TOKEN', ''))

try:
    client = ZohoPaymentService.get_client()
    print("SUCCESS: Zoho Payments Client built successfully!")
    print("Client Details:", client)
except Exception as e:
    print("FAILED to build Zoho Payments Client:", e)
