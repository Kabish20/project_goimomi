import os
import django
import json
import sys

# Add project root to sys.path
if os.name == 'nt':
    sys.path.append('d:\\G\\goimomi-holidays-backend')
else:
    sys.path.append('/home/ubuntu/project_goimomi/goimomi-holidays-backend')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Holidays.models import HolidayPackage, ItineraryDay, Inclusion, Exclusion, Highlight

def restore_full():
    # Detect if on Windows or Linux
    if os.name == 'nt':
        json_path = 'd:/G/full_restoration_data.json'
    else:
        json_path = '/home/ubuntu/project_goimomi/full_restoration_data.json'
    
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for entry in data:
        pkg_id = entry['id']
        title_safe = entry['title'].encode('ascii', 'ignore').decode('ascii')
        
        package, created = HolidayPackage.objects.get_or_create(
            id=pkg_id,
            defaults={
                'title': entry['title'],
                'description': entry['description'],
                'category': 'International',
                'days': int(entry.get('days', 1)),
                'Offer_price': int(entry.get('offer_price', 0)),
                'price': int(entry.get('price', 0)),
                'starting_city': 'Any Starting Cities',
                'is_active': True
            }
        )
        
        if not created:
            package.title = entry['title']
            package.description = entry['description']
            package.days = int(entry.get('days', 1))
            package.Offer_price = int(entry.get('offer_price', 0))
            package.price = int(entry.get('price', 0))
            package.save()
            
        print(f"{'Created' if created else 'Updated'} Package {pkg_id}: {title_safe}")
        
        # Restore Itinerary
        for day_data in entry['itinerary']:
            day_num = int(day_data['day'])
            day_obj, d_created = ItineraryDay.objects.get_or_create(
                package=package,
                day_number=day_num,
                defaults={
                    'title': day_data['title'],
                    'description': day_data['description'],
                    'details_json': {}
                }
            )
            if not d_created:
                day_obj.title = day_data['title']
                day_obj.description = day_data['description']
                # Preservation rule: only set to {} if absolutely null/empty
                if not day_obj.details_json:
                    day_obj.details_json = {}
                day_obj.save()
        
        # Restore Inclusions/Exclusions/Highlights
        package.inclusions.all().delete()
        for txt in entry.get('inclusions', []):
            Inclusion.objects.create(package=package, text=txt)
            
        package.exclusions.all().delete()
        for txt in entry.get('exclusions', []):
            Exclusion.objects.create(package=package, text=txt)
            
        package.highlights.all().delete()
        for txt in entry.get('highlights', []):
            Highlight.objects.create(package=package, text=txt)
            
        print(f"  Restored: {len(entry['itinerary'])} days, {len(entry.get('inclusions', []))} incl, {len(entry.get('exclusions', []))} excl.")

if __name__ == "__main__":
    restore_full()
