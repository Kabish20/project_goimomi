from django.core.management.base import BaseCommand
from Holidays.models import VehicleMaster

class Command(BaseCommand):
    help = 'Fixes vehicle photo paths in database to match existing files on disk'

    def handle(self, *args, **options):
        vehicles = VehicleMaster.objects.all()
        updated_count = 0
        
        for v in vehicles:
            name_lower = v.name.lower()
            matched_path = None
            
            if 'coaster' in name_lower or 'coster' in name_lower:
                matched_path = 'vehicles/Coaster.jpeg'
            elif 'hiace' in name_lower:
                matched_path = 'vehicles/Toyota_Hiace_Super_LWB_High_Roof_Van_-_AU_version_2004-10.jpeg'
            elif 'gmc' in name_lower and ('25' in name_lower or 'new' in name_lower):
                matched_path = 'vehicles/Buy__Sell_Cars___Millions_Listed_Prices__Deal_Ratings___CarGurus.jpeg'
            elif 'gmc' in name_lower:
                matched_path = 'vehicles/2020_Gmc_Yukon_Xl_Pictures__Engine.jpeg'
            elif 'staria' in name_lower or 'starex' in name_lower or 'h1' in name_lower:
                matched_path = 'vehicles/All_New_2025_HYUNDAI_GRAND_STAREX_LUXURY_-_The_Best_MPV_VAN_of_the_Year.jpeg'
            elif 'taurus' in name_lower or 'ford' in name_lower:
                matched_path = 'vehicles/Owning_a_2011_Ford_Taurus_SEL__Common_Problems_and_Maintenance_Tips.jpeg'
            elif 'camry' in name_lower or 'sonata' in name_lower or 'sedan' in name_lower:
                matched_path = 'vehicles/download_2_YaJg5h3.jpeg'
            elif 'bus' in name_lower:
                matched_path = 'vehicles/11_Image_Hyundai_Grand_Starex_2020.jpeg'
                
            if matched_path:
                # Django ImageField expects the path relative to MEDIA_ROOT
                if v.photo.name != matched_path:
                    self.stdout.write(self.style.WARNING(f"Updating '{v.name}' photo from '{v.photo.name}' to '{matched_path}'"))
                    v.photo.name = matched_path
                    v.save()
                    updated_count += 1
            else:
                self.stdout.write(self.style.ERROR(f"No mapping found for vehicle '{v.name}'"))
                
        self.stdout.write(self.style.SUCCESS(f"Successfully updated {updated_count} vehicle photos."))
