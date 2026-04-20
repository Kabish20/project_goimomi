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

p = HolidayPackage.objects.filter(id=37).first()
if p:
    serializer = HolidayPackageSerializer(p)
    print(json.dumps(serializer.data, indent=2))
else:
    print("Package #37 NOT FOUND")
