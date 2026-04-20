import os
import django
import sys
import json

# Set up Django environment
sys.path.append('/home/ubuntu/project/goimomi-holidays-backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Holidays.models import HolidayPackage
from Holidays.serializers import HolidayPackageSerializer

packages = HolidayPackage.objects.filter(is_active=True)[:5]
for pkg in packages:
    print(f"--- PKG ID: {pkg.id} ---")
    data = HolidayPackageSerializer(pkg).data
    print(f"Keys: {list(data.keys())}")
    print(f"Destinations: {data.get('destinations', 'MISSING')}")
    print(f"Region: {data.get('region', 'MISSING')}")
    print("-" * 20)
