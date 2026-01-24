#!/usr/bin/env python
"""
Test script to verify visa update functionality
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Holidays.models import Visa

print("=== CURRENT VISAS IN DATABASE ===")
for v in Visa.objects.all():
    print(f"ID:{v.id} | Country:[{v.country}] | Title:[{v.title}]")
    print(f"  Validity:[{v.validity}] | Duration:[{v.duration}]")
    print()

# Test updating a visa
print("\n=== TESTING UPDATE ===")
visa = Visa.objects.first()
if visa:
    print(f"Before update - Validity: [{visa.validity}], Duration: [{visa.duration}]")
    
    visa.validity = "TEST 60 days"
    visa.duration = "TEST 60 days"
    visa.save()
    
    visa.refresh_from_db()
    print(f"After update - Validity: [{visa.validity}], Duration: [{visa.duration}]")
    
    # Revert
    visa.validity = "30 days"
    visa.duration = "30 days"
    visa.save()
    print("Reverted back to original")
