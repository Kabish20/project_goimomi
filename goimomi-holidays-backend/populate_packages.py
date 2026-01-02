import os
import django
import sys
import random

# Add the project directory to the sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Holidays.models import HolidayPackage, ItineraryDay

def populate_packages():
    # Sample data for packages
    packages_info = [
        {"title": "Wonderful Goa Escape", "starting_city": "Mumbai", "category": "Domestic"},
        {"title": "Kerala Backwaters", "starting_city": "Kochi", "category": "Domestic"},
        {"title": "Thailand Adventure", "starting_city": "Bangkok", "category": "International"},
        {"title": "Dubai Delight", "starting_city": "Dubai", "category": "International"},
    ]

    print("Starting package population...")

    for info in packages_info:
        # Randomly assign 3 or 4 days as requested
        days_count = random.choice([3, 4])
        
        # Create the Holiday Package
        package = HolidayPackage.objects.create(
            title=info['title'],
            description=f"A wonderful {days_count}-day trip to {info['title']}.",
            category=info['category'],
            starting_city=info['starting_city'],
            days=days_count,
            Offer_price=15000 * days_count,
            price=20000 * days_count,
            # Using placeholder images that exist in your media folder
            # Ensure these paths are correct relative to your MEDIA_ROOT
            header_image="packages/headers/ID1.png", 
            card_image="packages/cards/ID10.png"
        )
        
        print(f"Created Package: '{package.title}' with {days_count} Days")

        # Project the itinerary part based on the number of days
        for day in range(1, days_count + 1):
            ItineraryDay.objects.create(
                package=package,
                day_number=day,
                title=f"Day {day}: Exploring {info['title']}",
                description=f"Detailed itinerary for Day {day}. Visit exciting places and enjoy local cuisine."
            )
            print(f"  -> Generated Itinerary Day {day}")
            
    print("Done projecting itineraries.")

if __name__ == "__main__":
    populate_packages()
