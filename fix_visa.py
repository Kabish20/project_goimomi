import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from Holidays.models import Visa

def fix():
    try:
        # Check visa with ID 6 (the one with price 2850)
        v = Visa.objects.filter(id=6).first()
        if v:
            print(f"Current: ID={v.id}, Title={v.title}, Validity={v.validity}, Duration={v.duration}, Country={v.country}")
            v.validity = "60 Days"
            v.duration = "60 Days"
            v.save()
            print(f"Updated: ID={v.id}, Validity={v.validity}, Duration={v.duration}")
        else:
            print("Visa ID 6 not found")
            
        # Check if there are visas with wrong countries
        print("\nAll Visas:")
        for v in Visa.objects.all():
            print(f"ID:{v.id} | Country:{v.country} | Title:{v.title}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix()
