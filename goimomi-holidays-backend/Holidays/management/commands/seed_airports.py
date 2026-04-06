import requests
import csv
from io import StringIO
from django.core.management.base import BaseCommand
from Holidays.models import Airport, City, Country

class Command(BaseCommand):
    help = 'Seed global airports (both international and domestic) from OurAirports'

    def handle(self, *args, **kwargs):
        AIRPORTS_CSV_URL = "https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv"
        COUNTRIES_CSV_URL = "https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/countries.csv"

        self.stdout.write("Fetching country data...")
        try:
            countries_res = requests.get(COUNTRIES_CSV_URL)
            countries_res.raise_for_status()
            iso_to_name = {row['code']: row['name'] for row in csv.DictReader(StringIO(countries_res.text))}
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error fetching countries: {e}"))
            return

        self.stdout.write("Fetching airport data...")
        try:
            airports_res = requests.get(AIRPORTS_CSV_URL)
            airports_res.raise_for_status()
            airports_data = csv.DictReader(StringIO(airports_res.text))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error fetching airports: {e}"))
            return

        self.stdout.write("Processing airports...")
        
        country_cache = {c.name.lower(): c for c in Country.objects.all()}
        country_name_mapping = {
            "United States": "United States of America",
            "South Korea": "South Korea", 
            "Russian Federation": "Russia",
            "Viet Nam": "Vietnam",
            "Iran, Islamic Republic of": "Iran",
            "Syrian Arab Republic": "Syria",
            "Czechia": "Czech Republic",
            "Hong Kong": "China",
            "Taiwan, Province of China": "Taiwan",
            "Tanzania, United Republic of": "Tanzania",
            "Congo, The Democratic Republic of the": "Congo (Democratic Republic)",
        }

        created_count = 0
        updated_count = 0
        city_created = 0
        processed = 0

        for row in airports_data:
            # We want airports with IATA codes (these are the ones used in travel)
            iata = row['iata_code'].strip().upper()
            if not iata or len(iata) != 3:
                continue
            
            # Skip closed airports or minor types if they don't have commercial relevance
            if row['type'] not in ['large_airport', 'medium_airport', 'small_airport']:
                continue

            iso_code = row['iso_country']
            country_name_raw = iso_to_name.get(iso_code, "")
            country_name = country_name_mapping.get(country_name_raw, country_name_raw)
            
            country = country_cache.get(country_name.lower())
            if not country and country_name:
                country, created = Country.objects.get_or_create(name=country_name)
                country_cache[country_name.lower()] = country
            
            if not country:
                continue

            city_name = row['municipality'].strip() if row['municipality'] else "Unknown City"
            city = City.objects.filter(name__iexact=city_name, country=country).first()
            if not city:
                city = City.objects.create(name=city_name, country=country)
                city_created += 1
            
            airport, created = Airport.objects.update_or_create(
                iata_code=iata,
                defaults={
                    'name': row['name'].strip(),
                    'city': city
                }
            )
            
            if created:
                created_count += 1
            else:
                updated_count += 1
            
            processed += 1
            if processed % 1000 == 0:
                self.stdout.write(f"Processed {processed} airports...")

        self.stdout.write(self.style.SUCCESS(f"\nSeeding Complete!"))
        self.stdout.write(f"Total processed: {processed}")
        self.stdout.write(f"New airports: {created_count}")
        self.stdout.write(f"Updated: {updated_count}")
        self.stdout.write(f"New cities: {city_created}")
