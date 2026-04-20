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
    print(f"ID: {p.id}")
    print(f"Title: {p.title}")
    print(f"is_active: {p.is_active}")
    print(f"Category: {p.category}")
    print(f"Region: {p.region.name if p.region else 'NONE'}")
    
    # Check if destinations is a M2M field
    if hasattr(p, 'destinations'):
        dests = p.destinations.all()
        print(f"Destinations Count: {dests.count()}")
        for d in dests:
            print(f"  - {d.name}")
    else:
        print("No 'destinations' field found.")
        
    print(f"Price: {p.price}")
else:
    print("Package #37 NOT FOUND")
