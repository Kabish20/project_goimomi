import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Holidays.models import VehicleBrand

brands = VehicleBrand.objects.all()
print(f"Total Brands: {brands.count()}")
for b in brands:
    print(f"ID: {b.id}, Name: {b.name}")
