
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from Holidays.models import ItineraryDay, ItineraryMaster

def backfill():
    days_without_master = ItineraryDay.objects.filter(master_template__isnull=True)
    print(f"Found {days_without_master.count()} itinerary days without a master template.")
    
    count = 0
    for day in days_without_master:
        if day.title:
            # Check if a master with this name already exists to avoid dupes?
            # Or just create one as requested. Let's try to match by title first.
            existing_master = ItineraryMaster.objects.filter(name=day.title).first()
            
            if existing_master:
                print(f"Linking day '{day.title}' to existing master '{existing_master.name}'")
                day.master_template = existing_master
            else:
                print(f"Creating new master for day '{day.title}'")
                new_master = ItineraryMaster.objects.create(
                    name=day.title,
                    title=day.title,
                    description=day.description,
                    image=day.image # This copies the file reference
                )
                day.master_template = new_master
            
            day.save()
            count += 1
            
    print(f"Successfully processed {count} itinerary days.")

if __name__ == "__main__":
    backfill()
