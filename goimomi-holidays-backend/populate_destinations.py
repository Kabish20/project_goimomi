import os
import django
import sys

# Add the project directory to the sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Holidays.models import Destination

data = [
  {
    "country": "India",
    "region": "DOMESTIC (INDIA)",
    "cities": [
      "Goa",
      "Kerala",
      "Manali",
      "Shimla",
      "Ooty",
      "Kodaikanal",
      "Udaipur",
      "Jaipur",
      "Agra",
      "Varanasi",
      "Rishikesh",
      "Darjeeling",
      "Delhi",
      "Ladakh",
      "Andaman & Nicobar Islands",
      "Lakshadweep",
      "Puducherry",
      "Mumbai",
      "Chennai",
      "Bengaluru",
      "Hyderabad",
      "Kolkata",
      "Ahmedabad",
      "Pune",
      "Amritsar",
      "Chandigarh"
    ]
  },
  {
    "country": "Thailand",
    "region": "SOUTH EAST ASIA",
    "cities": [
      "Bangkok",
      "Pattaya",
      "Phuket",
      "Krabi",
      "Chiang Mai"
    ]
  },
  {
    "country": "Vietnam",
    "region": "SOUTH EAST ASIA",
    "cities": [
      "Hanoi",
      "Ho Chi Minh City",
      "Da Nang",
      "Halong Bay"
    ]
  },
  {
    "country": "Cambodia",
    "region": "SOUTH EAST ASIA",
    "cities": [
      "Siem Reap",
      "Phnom Penh"
    ]
  },
  {
    "country": "Laos",
    "region": "SOUTH EAST ASIA",
    "cities": [
      "Vientiane",
      "Luang Prabang"
    ]
  },
  {
    "country": "Malaysia",
    "region": "SOUTH EAST ASIA",
    "cities": [
      "Kuala Lumpur",
      "Langkawi",
      "Penang"
    ]
  },
  {
    "country": "Singapore",
    "region": "SOUTH EAST ASIA",
    "cities": [
      "Singapore"
    ]
  },
  {
    "country": "Indonesia",
    "region": "SOUTH EAST ASIA",
    "cities": [
      "Bali",
      "Jakarta",
      "Yogyakarta"
    ]
  },
  {
    "country": "Philippines",
    "region": "SOUTH EAST ASIA",
    "cities": [
      "Manila",
      "Cebu",
      "Boracay"
    ]
  },
  {
    "country": "United Arab Emirates",
    "region": "MIDDLE EAST",
    "cities": [
      "Dubai",
      "Abu Dhabi",
      "Sharjah",
      "Ajman"
    ]
  },
  {
    "country": "Saudi Arabia",
    "region": "MIDDLE EAST",
    "cities": [
      "Makkah",
      "Madinah",
      "Riyadh",
      "Jeddah"
    ]
  },
  {
    "country": "Qatar",
    "region": "MIDDLE EAST",
    "cities": [
      "Doha"
    ]
  },
  {
    "country": "Oman",
    "region": "MIDDLE EAST",
    "cities": [
      "Muscat",
      "Salalah"
    ]
  },
  {
    "country": "Turkey",
    "region": "EUROPE",
    "cities": [
      "Istanbul",
      "Cappadocia"
    ]
  },
  {
    "country": "United Kingdom",
    "region": "EUROPE",
    "cities": [
      "London",
      "Manchester",
      "Birmingham",
      "Liverpool",
      "Leeds",
      "Bristol",
      "Oxford",
      "Cambridge",
      "Edinburgh",
      "Glasgow",
      "York",
      "Bath"
    ]
  },
  {
    "country": "France",
    "region": "EUROPE",
    "cities": [
      "Paris",
      "Nice"
    ]
  },
  {
    "country": "Germany",
    "region": "EUROPE",
    "cities": [
      "Berlin",
      "Munich"
    ]
  },
  {
    "country": "Italy",
    "region": "EUROPE",
    "cities": [
      "Rome",
      "Venice",
      "Florence",
      "Milan"
    ]
  },
  {
    "country": "Switzerland",
    "region": "EUROPE",
    "cities": [
      "Zurich",
      "Lucerne",
      "Interlaken"
    ]
  },
  {
    "country": "Austria",
    "region": "EUROPE",
    "cities": [
      "Vienna",
      "Salzburg"
    ]
  },
  {
    "country": "Spain",
    "region": "EUROPE",
    "cities": [
      "Barcelona",
      "Madrid"
    ]
  },
  {
    "country": "Greece",
    "region": "EUROPE",
    "cities": [
      "Athens",
      "Santorini"
    ]
  },
  {
    "country": "USA",
    "region": "AMERICAS",
    "cities": [
      "New York",
      "Las Vegas",
      "Los Angeles"
    ]
  },
  {
    "country": "Canada",
    "region": "AMERICAS",
    "cities": [
      "Toronto",
      "Vancouver"
    ]
  },
  {
    "country": "Australia",
    "region": "AUSTRALIA & NEW ZEALAND",
    "cities": [
      "Sydney",
      "Melbourne"
    ]
  },
  {
    "country": "New Zealand",
    "region": "AUSTRALIA & NEW ZEALAND",
    "cities": [
      "Auckland",
      "Queenstown"
    ]
  },
  {
    "country": "Maldives",
    "region": "SOUTH ASIA",
    "cities": [
      "Malé"
    ]
  },
  {
    "country": "Nepal",
    "region": "SOUTH ASIA",
    "cities": [
      "Kathmandu",
      "Pokhara"
    ]
  },
  {
    "country": "Bhutan",
    "region": "SOUTH ASIA",
    "cities": [
      "Thimphu",
      "Paro"
    ]
  }
]

print("Starting population script...")

# OPTIONAL: Clear existing data to avoid duplicates/conflicts?
# Uncomment the next line if you want to WIPE all destinations first.
# Destination.objects.all().delete()

for entry in data:
    region = entry.get('region')
    cities = entry.get('cities', [])
    country = entry.get('country')
    
    for city_name in cities:
        # We search by 'name' (city name).
        # We ensure 'region', 'city', and 'country' fields are updated.
        obj, created = Destination.objects.get_or_create(
            name=city_name,
            defaults={
                'region': region,
                'city': city_name,
                'country': country
            }
        )
        
        if created:
            print(f"Created: {city_name} ({country})")
        else:
            # FORCE UPDATE: If it exists, update region, city, and country to match current data
            updated = False
            if obj.region != region:
                obj.region = region
                updated = True
            if obj.city != city_name:
                obj.city = city_name
                updated = True
            if obj.country != country:
                obj.country = country
                updated = True
            
            if updated:
                obj.save()
                print(f"Updated: {city_name} ({country})")
            else:
                print(f"Exists (No Change): {city_name}")

print("Done.")
