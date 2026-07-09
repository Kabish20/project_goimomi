import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.conf import settings
from Holidays.services.zoho_payment import ZohoPaymentService

print("ZOHO_CLIENT_ID:", getattr(settings, 'ZOHO_CLIENT_ID', ''))
print("ZOHO_CLIENT_SECRET:", getattr(settings, 'ZOHO_CLIENT_SECRET', ''))
print("ZOHO_REFRESH_TOKEN:", getattr(settings, 'ZOHO_REFRESH_TOKEN', ''))

token = ZohoPaymentService.get_access_token()
print("ACCESS TOKEN RESULT:", token)

