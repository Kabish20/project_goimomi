import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from Holidays.models import Visa

def fix_countries():
    print("=== Checking Visas for Country mismatches ===")
    for v in Visa.objects.all():
        # Check for Dubai visas assigned to other countries
        if 'DUBAI' in v.title.upper() and v.country != 'United Arab Emirates':
            print(f"FIXING: Visa '{v.title}' (ID {v.id}) had country '{v.country}'. Changing to 'United Arab Emirates'")
            v.country = 'United Arab Emirates'
            v.save()
        
        # Check for USA visas
        if 'USA' in v.title.upper() or 'UNITED STATES' in v.title.upper():
            if v.country != 'United States of America':
                print(f"FIXING: Visa '{v.title}' (ID {v.id}) had country '{v.country}'. Changing to 'United States of America'")
                v.country = 'United States of America'
                v.save()

if __name__ == "__main__":
    fix_countries()
