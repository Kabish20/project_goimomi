import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Holidays.models import UmrahDestination

destinations = [
    {"name": "Abu Dhabi", "country": "United Arab Emirates"},
    {"name": "Sharjah", "country": "United Arab Emirates"},
    {"name": "Ajman", "country": "United Arab Emirates"},
    {"name": "Dubai", "country": "United Arab Emirates"},
    {"name": "Makkah", "country": "Saudi Arabia"},
    {"name": "Madinah", "country": "Saudi Arabia"},
    {"name": "Riyadh", "country": "Saudi Arabia"},
    {"name": "Jeddah", "country": "Saudi Arabia"},
    {"name": "Doha", "country": "Qatar"},
    {"name": "Muscat", "country": "Oman"},
    {"name": "Salalah", "country": "Oman"},
]

def populate():
    print("Populating Umrah Destinations...")
    count = 0
    for dest in destinations:
        obj, created = UmrahDestination.objects.get_or_create(
            name=dest["name"],
            country=dest["country"]
        )
        if created:
            count += 1
            print(f"Created: {dest['name']} - {dest['country']}")
        else:
            print(f"Exists: {dest['name']} - {dest['country']}")
    print(f"Done! Created {count} new destinations.")

if __name__ == "__main__":
    populate()
