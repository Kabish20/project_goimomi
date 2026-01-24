from Holidays.models import Visa
import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

print("ID | TITLE | VALIDITY | DURATION | COUNTRY")
print("-" * 50)
for v in Visa.objects.all():
    print(f"{v.id} | {v.title} | {v.validity} | {v.duration} | {v.country}")
