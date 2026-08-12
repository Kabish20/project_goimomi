import os
import re
from django.core.management.base import BaseCommand
from Holidays.models import SightseeingMaster, City, Region, Country
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seed sightseeing data from sightseeing.txt'

    def handle(self, *args, **kwargs):
        file_path = 'sightseeing.txt'
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File {file_path} not found'))
            return

        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        count = 0
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Data is tab-separated as per user request
            parts = line.split('\t')
            if len(parts) < 10:
                self.stdout.write(self.style.WARNING(f'Skipping invalid line: {line}'))
                continue

            country_name = parts[0].strip()
            region_name = parts[1].strip()
            city_name = parts[2].strip()
            name = parts[3].strip()
            description = parts[4].strip()
            address = parts[5].strip()
            duration = parts[6].strip()
            price_raw = parts[7].strip()
            lat = parts[8].strip()
            lng = parts[9].strip()

            # Resolve hierarchy
            country, _ = Country.objects.get_or_create(name=country_name)
            region, _ = Region.objects.get_or_create(name=region_name, country=country)
            city, _ = City.objects.get_or_create(name=city_name, region=region, country=country)

            # Parse price
            price = Decimal('0.00')
            if price_raw.lower() != 'free':
                # Extract digits
                match = re.search(r'[\d,.]+', price_raw)
                if match:
                    price_val = match.group().replace(',', '')
                    try:
                        price = Decimal(price_val)
                    except:
                        pass

            # Create or update sightseeing
            obj, created = SightseeingMaster.objects.update_or_create(
                name=name,
                city_link=city,
                defaults={
                    'description': description,
                    'address': address,
                    'city': city_name,
                    'duration': duration,
                    'price': price,
                    'latitude': Decimal(lat) if lat else None,
                    'longitude': Decimal(lng) if lng else None,
                }
            )
            if created:
                count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {count} new sightseeing records'))
