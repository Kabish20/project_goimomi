import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Holidays.models import RoomType

room_types = [
    "Single Room", "Double Room", "Twin Room", "Triple Room", "Quad Room",
    "Standard Room", "Superior Room", "Deluxe Room", "Executive Room",
    "King Room", "Queen Room", "Double Queen Room", "Twin Bed Room",
    "Hollywood Twin Room", "Murphy Bed Room", "Suite", "Junior Suite",
    "Executive Suite", "Presidential Suite", "Royal Suite", "Family Suite",
    "Honeymoon Suite", "Penthouse Suite", "Studio Room", "Loft Room",
    "Cabana Room", "Villa", "Beachfront Room", "Overwater Bungalow",
    "Cottage", "Chalet", "Bungalow", "Tree House", "Family Room",
    "Interconnecting Room", "Adjoining Room", "Dormitory Room", "Shared Room",
    "Accessible Room", "Disabled Friendly Room", "Hearing Accessible Room",
    "Wheelchair Accessible Room", "Business Room", "Club Room",
    "Executive Floor Room", "High Floor Room", "Corner Room", "Sea View Room",
    "Ocean View Room", "City View Room", "Garden View Room", "Mountain View Room",
    "Pool View Room", "Lake View Room", "Serviced Apartment", "Residence Room",
    "Extended Stay Room", "Kitchenette Room", "Economy Room", "Budget Room",
    "Compact Room", "Micro Room", "Capsule Room"
]

for rt_name in room_types:
    RoomType.objects.get_or_create(name=rt_name)

print(f"Successfully seeded {len(room_types)} room types.")
