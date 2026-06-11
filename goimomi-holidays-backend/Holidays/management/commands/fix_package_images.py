from django.core.management.base import BaseCommand
from Holidays.models import HolidayPackage

class Command(BaseCommand):
    help = 'Fixes missing package images in database with valid existing fallbacks'

    def handle(self, *args, **options):
        packages = HolidayPackage.objects.all()
        updated_count = 0
        
        for p in packages:
            title_lower = p.title.lower()
            desc_lower = (p.description or "").lower()
            
            # Determine fallback images based on destination/keywords
            if 'kashmir' in title_lower or 'kashmir' in desc_lower or 'srinagar' in title_lower:
                fallback_card = 'packages/cards/Winter_Wonderland_in_Srinagar__Eternal_Serenity_of_Kashmirs_Dal_Lake.jpeg'
                fallback_header = 'packages/headers/Nanga_Parat_mountain_the_Karakorams.jpeg'
            elif 'thailand' in title_lower or 'pattaya' in title_lower or 'bangkok' in title_lower or 'phuket' in title_lower:
                fallback_card = 'packages/cards/Pattaya_Night_Light.png'
                fallback_header = 'packages/headers/Aerial_top_view_of_of_Pattay.png'
            elif 'umrah' in title_lower or 'umrah' in desc_lower or 'makkah' in title_lower or 'madinah' in title_lower:
                fallback_card = 'packages/cards/Umrah_Package.jpeg'
                fallback_header = 'packages/headers/Khana_kabba.jpeg'
            elif 'cruise' in title_lower or 'cruise' in desc_lower:
                fallback_card = 'packages/cards/Cruise_Trip_in_India__Luxury_Cruises_Scenic_Views__Unforgettable_Adventures.jpeg'
                fallback_header = 'packages/headers/Cruise_Trip_in_India__Luxury_Cruises_Scenic_Views__Unforgettable_Adventures.jpeg'
            elif 'london' in title_lower or 'europe' in title_lower or 'paris' in title_lower or 'uk' in title_lower:
                fallback_card = 'packages/cards/download_5.jpeg'
                fallback_header = 'packages/headers/Shanghi_China.jpeg'
            else:
                # Default generic fallbacks
                fallback_card = 'packages/cards/download.jpeg'
                fallback_header = 'packages/headers/viral_pin.jpeg'

            changed = False
            
            # Check and fix card image
            if not p.card_image or not p.card_image.storage.exists(p.card_image.name):
                self.stdout.write(self.style.WARNING(f"Fixing missing card image for '{p.title}': '{p.card_image.name if p.card_image else 'None'}' -> '{fallback_card}'"))
                p.card_image.name = fallback_card
                changed = True
                
            # Check and fix header image
            if not p.header_image or not p.header_image.storage.exists(p.header_image.name):
                self.stdout.write(self.style.WARNING(f"Fixing missing header image for '{p.title}': '{p.header_image.name if p.header_image else 'None'}' -> '{fallback_header}'"))
                p.header_image.name = fallback_header
                changed = True
                
            if changed:
                p.save()
                updated_count += 1
                
        self.stdout.write(self.style.SUCCESS(f"Successfully repaired {updated_count} packages."))
