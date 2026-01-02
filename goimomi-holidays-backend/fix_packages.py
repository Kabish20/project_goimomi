import os
import django
import sys

# Add the project directory to the sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Holidays.models import HolidayPackage, ItineraryDay

def fix_and_project():
    packages = HolidayPackage.objects.all()
    print(f"Found {packages.count()} packages. Starting fix...")

    for pkg in packages:
        print(f"Processing: {pkg.title}")
        
        # 1. Fix Prices: If Offer_price is 0, it won't look good on the UI.
        # We'll set Offer_price to the value in 'price' and set 'price' (the old price) to something higher (or null).
        if pkg.Offer_price == 0 and (pkg.price or 0) > 0:
            current_price = pkg.price
            pkg.Offer_price = current_price
            pkg.price = int(current_price * 1.2) # Make the "old price" 20% higher
            print(f"  -> Fixed prices: Offer={pkg.Offer_price}, Old={pkg.price}")
            pkg.save()
        elif pkg.Offer_price == 0:
            # Fallback if both are 0
            pkg.Offer_price = 45000
            pkg.price = 55000
            print(f"  -> Set default prices: Offer={pkg.Offer_price}, Old={pkg.price}")
            pkg.save()

        # 2. Project Itineraries: Ensure there are exactly 'pkg.days' itinerary rows
        current_itinerary_count = pkg.itinerary.count()
        if current_itinerary_count < pkg.days:
            diff = pkg.days - current_itinerary_count
            for i in range(current_itinerary_count + 1, pkg.days + 1):
                ItineraryDay.objects.create(
                    package=pkg,
                    day_number=i,
                    title=f"Day {i}: Exploration of {pkg.title}",
                    description=f"Detailed itinerary for Day {i}. Enjoy the sights and local culture."
                )
            print(f"  -> Added {diff} itinerary days.")
        elif current_itinerary_count > pkg.days:
            # Optionally remove extra days if count > days
            to_remove = pkg.itinerary.all().order_by('-day_number')[:current_itinerary_count - pkg.days]
            count = 0
            for item in to_remove:
                item.delete()
                count += 1
            print(f"  -> Removed {count} extra itinerary days.")
        else:
            print("  -> Itinerary count matches days.")

    print("All packages fixed and projected.")

if __name__ == "__main__":
    fix_and_project()
