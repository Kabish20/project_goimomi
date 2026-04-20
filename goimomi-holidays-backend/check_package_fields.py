import os
import django
import sys

# Set up Django environment
sys.path.append('/home/ubuntu/project/goimomi-holidays-backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Holidays.models import HolidayPackage

p = HolidayPackage.objects.filter(id=37).first()
if p:
    print("FIELDS DETECTED:")
    for f in p._meta.get_fields():
        print(f"  - {f.name} ({type(f).__name__})")
else:
    print("NOT FOUND")
