import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Holidays.models import Destination

# Complete mapping: destination name -> country
COUNTRY_MAP = {
    # DOMESTIC (INDIA) - Indian states/cities
    "India": "India",
    "Rajasthan": "India",
    "Andhra Pradesh": "India",
    "Arunachal Pradesh": "India",
    "Assam": "India",
    "Bihar": "India",
    "Chhattisgarh": "India",
    "Gujarat": "India",
    "Haryana": "India",
    "Himachal Pradesh": "India",
    "Jharkhand": "India",
    "Karnataka": "India",
    "Madhya Pradesh": "India",
    "Maharashtra": "India",
    "Manipur": "India",
    "Meghalaya": "India",
    "Mizoram": "India",
    "Nagaland": "India",
    "Odisha": "India",
    "Punjab": "India",
    "Sikkim": "India",
    "Tamil Nadu": "India",
    "Telangana": "India",
    "Tripura": "India",
    "Uttar Pradesh": "India",
    "Uttarakhand": "India",
    "West Bengal": "India",
    "Jammu & Kashmir": "India",
    "Dadra & Nagar Haveli and Daman & Diu": "India",

    # SOUTH EAST ASIA
    "Thailand": "Thailand",
    "Vietnam": "Vietnam",
    "Vietnam, Cambodia & Laos": "South East Asia",
    "Cambodia": "Cambodia",
    "Laos": "Laos",
    "Malaysia": "Malaysia",
    "Indonesia": "Indonesia",
    "Philippines": "Philippines",
    "Myanmar": "Myanmar",
    "Yangon": "Myanmar",
    "Bagan": "Myanmar",
    "Brunei": "Brunei",
    "East Timor": "East Timor",

    # MIDDLE EAST
    "United Arab Emirates": "United Arab Emirates",
    "Saudi Arabia": "Saudi Arabia",
    "Qatar": "Qatar",
    "Oman": "Oman",
    "Bahrain": "Bahrain",
    "Manama": "Bahrain",
    "Kuwait": "Kuwait",
    "Kuwait City": "Kuwait",
    "Jordan": "Jordan",
    "Amman": "Jordan",
    "Petra": "Jordan",
    "Israel": "Israel",
    "Jerusalem": "Israel",
    "Tel Aviv": "Israel",
    "Palestine": "Palestine",
    "Bethlehem": "Palestine",
    "Lebanon": "Lebanon",
    "Beirut": "Lebanon",
    "Iraq": "Iraq",
    "Baghdad": "Iraq",
    "Iran": "Iran",
    "Tehran": "Iran",
    "Yemen": "Yemen",
    "Syria": "Syria",

    # EUROPE
    "Europe": "Europe",
    "United Kingdom": "United Kingdom",
    "Scotland": "United Kingdom",
    "Ireland": "Ireland",
    "France": "France",
    "Belgium": "Belgium",
    "Brussels": "Belgium",
    "Netherlands": "Netherlands",
    "Amsterdam": "Netherlands",
    "Luxembourg": "Luxembourg",
    "Germany": "Germany",
    "Austria": "Austria",
    "Switzerland": "Switzerland",
    "Poland": "Poland",
    "Czech Republic": "Czech Republic",
    "Prague": "Czech Republic",
    "Hungary": "Hungary",
    "Budapest": "Hungary",
    "Italy": "Italy",
    "Spain": "Spain",
    "Portugal": "Portugal",
    "Lisbon": "Portugal",
    "Greece": "Greece",
    "Turkey": "Turkey",
    "Norway": "Norway",
    "Sweden": "Sweden",
    "Denmark": "Denmark",
    "Finland": "Finland",
    "Iceland": "Iceland",
    "Russia": "Russia",
    "Ukraine": "Ukraine",
    "Romania": "Romania",
    "Bulgaria": "Bulgaria",
    "Croatia": "Croatia",
    "Slovenia": "Slovenia",
    "Serbia": "Serbia",
    "Bosnia and Herzegovina": "Bosnia and Herzegovina",
    "Montenegro": "Montenegro",
    "Albania": "Albania",
    "North Macedonia": "North Macedonia",

    # UNITED KINGDOM region
    "England": "United Kingdom",
    "Wales": "United Kingdom",
    "Northern Ireland": "United Kingdom",
    "Brighton": "United Kingdom",
    "Nottingham": "United Kingdom",
    "Inverness": "United Kingdom",
    "Cardiff": "United Kingdom",
    "Swansea": "United Kingdom",
    "Belfast": "United Kingdom",
    "Derry": "United Kingdom",
    "Dublin": "Ireland",

    # CENTRAL ASIA / CIS
    "Kazakhstan": "Kazakhstan",
    "Almaty": "Kazakhstan",
    "Astana": "Kazakhstan",
    "Uzbekistan": "Uzbekistan",
    "Tashkent": "Uzbekistan",
    "Samarkand": "Uzbekistan",
    "Bukhara": "Uzbekistan",
    "Kyrgyzstan": "Kyrgyzstan",
    "Bishkek": "Kyrgyzstan",
    "Tajikistan": "Tajikistan",
    "Dushanbe": "Tajikistan",
    "Turkmenistan": "Turkmenistan",
    "Ashgabat": "Turkmenistan",
    "Azerbaijan": "Azerbaijan",
    "Baku": "Azerbaijan",
    "Georgia": "Georgia",
    "Tbilisi": "Georgia",
    "Batumi": "Georgia",
    "Armenia": "Armenia",
    "Yerevan": "Armenia",
    "Moscow": "Russia",
    "Saint Petersburg": "Russia",
    "Kyiv": "Ukraine",
    "Belarus": "Belarus",
    "Minsk": "Belarus",
    "Moldova": "Moldova",
    "Chisinau": "Moldova",
    "Uzbekistan, Azerbaijan, Georgia": "Central Asia",

    # SOUTH ASIA
    "Nepal": "Nepal",
    "Bhutan": "Bhutan",
    "Nepal, Bhutan": "South Asia",
    "Sri Lanka": "Sri Lanka",
    "Maldives": "Maldives",

    # EAST ASIA
    "Taiwan": "Taiwan",
    "Japan": "Japan",
    "South Korea": "South Korea",
    "China": "China",
    "Hong Kong": "Hong Kong",

    # AUSTRALIA & NEW ZEALAND
    "Australia": "Australia",
    "New Zealand": "New Zealand",

    # AFRICA
    "South Africa": "South Africa",
    "Kenya": "Kenya",
    "Egypt": "Egypt",
    "Tanzania": "Tanzania",
    "Nigeria": "Nigeria",
    "Ghana": "Ghana",
    "Ethiopia": "Ethiopia",

    # AMERICAS
    "USA": "USA",
    "Canada": "Canada",
    "Mexico": "Mexico",
}

updated = 0
skipped = 0
not_found = []

for dest in Destination.objects.all():
    if not dest.country:  # only update if country is missing
        if dest.name in COUNTRY_MAP:
            dest.country = COUNTRY_MAP[dest.name]
            dest.save(update_fields=['country'])
            print(f"  UPDATED: [{dest.id}] {dest.name} -> {dest.country}")
            updated += 1
        else:
            not_found.append(f"[{dest.id}] {dest.name} (region: {dest.region})")
    else:
        skipped += 1

print(f"\n✅ Done! Updated: {updated} | Already had country: {skipped}")
if not_found:
    print(f"\n⚠️  Could not map ({len(not_found)}):")
    for n in not_found:
        print(f"   - {n}")
