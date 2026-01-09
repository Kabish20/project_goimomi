
import os
import django
import json

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from Holidays.models import HolidayPackage

packages = HolidayPackage.objects.all()
data = []
for p in packages:
    data.append({
        "id": p.id,
        "title": p.title,
        "with_flight": p.with_flight
    })

print(json.dumps(data, indent=2))
