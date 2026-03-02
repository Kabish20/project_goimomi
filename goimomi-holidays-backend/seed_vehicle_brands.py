import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Holidays.models import VehicleBrand

brands = [
    "Maruti Suzuki", "Tata Motors", "Mahindra", "Ashok Leyland", "Force Motors",
    "Hindustan Motors", "Premier", "ICML", "Toyota", "Lexus", "Honda", "Acura",
    "Nissan", "Infiniti", "Mazda", "Subaru", "Mitsubishi", "Suzuki", "Daihatsu",
    "Isuzu", "Mercedes-Benz", "BMW", "Audi", "Volkswagen", "Porsche", "Opel",
    "Maybach", "Smart", "Ford", "Chevrolet", "GMC", "Cadillac", "Buick",
    "Chrysler", "Dodge", "Jeep", "Tesla", "Lincoln", "Rivian", "Lucid",
    "Rolls-Royce", "Bentley", "Jaguar", "Land Rover", "Mini", "Aston Martin",
    "McLaren", "Lotus", "MG", "Renault", "Peugeot", "Citroën", "DS Automobiles",
    "Bugatti", "Ferrari", "Lamborghini", "Maserati", "Alfa Romeo", "Fiat",
    "Pagani", "Lancia", "Hyundai", "Kia", "Genesis", "Daewoo", "SsangYong",
    "BYD", "Geely", "Chery", "Great Wall", "Haval", "Wuling", "SAIC", "NIO",
    "XPeng", "Li Auto", "Hongqi", "Volvo", "Polestar", "Koenigsegg", "SEAT",
    "Cupra", "Skoda", "Lada", "GAZ", "UAZ", "Fisker", "VinFast", "Ora",
    "Ather", "Ola Electric"
]

# Using set to remove duplicates if any were in the original list
brands = sorted(list(set(brands)))

for brand_name in brands:
    brand, created = VehicleBrand.objects.get_or_create(name=brand_name)
    if created:
        print(f"Created brand: {brand_name}")
    else:
        print(f"Brand already exists: {brand_name}")

print("Seeding complete.")
