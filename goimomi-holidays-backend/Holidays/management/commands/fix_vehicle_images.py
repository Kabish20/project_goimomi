from django.core.management.base import BaseCommand
from Holidays.models import VehicleMaster

class Command(BaseCommand):
    help = 'Sets fallback vehicle photo paths ONLY when a vehicle has no photo or the file is missing. Never overwrites user-uploaded images.'

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
                # IMPORTANT: Only apply fallback if vehicle currently has NO photo or the file is missing on disk
                # Never overwrite a user-uploaded image
                has_photo = bool(v.photo and v.photo.name)
                file_exists = False
                if has_photo:
                    try:
                        file_exists = v.photo.storage.exists(v.photo.name)
                    except Exception:
                        file_exists = False

                if not has_photo or not file_exists:
                    self.stdout.write(self.style.WARNING(f"Setting fallback for '{v.name}' (no photo or missing file) -> '{matched_path}'"))
                    v.photo.name = matched_path
                    v.save()
                    updated_count += 1
                else:
                    self.stdout.write(self.style.SUCCESS(f"Skipping '{v.name}' - already has photo: '{v.photo.name}'"))
            else:
                self.stdout.write(self.style.ERROR(f"No mapping found for vehicle '{v.name}'"))
                
        self.stdout.write(self.style.SUCCESS(f"Successfully updated {updated_count} vehicle photos."))
