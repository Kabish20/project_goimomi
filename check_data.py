import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from Holidays.models import Visa, VisaApplication, Country

def run():
    try:
        print(f"Visa count: {Visa.objects.count()}")
        visas = Visa.objects.all()[:5]
        for v in visas:
            print(f"  {v.id}: {v.country} - {v.title}")
    except Exception as e:
        print(f"Error checking Visas: {e}")

    try:
        print(f"Country count: {Country.objects.count()}")
        countries = Country.objects.all()[:5]
        for c in countries:
            print(f"  {c.id}: {c.name}")
    except Exception as e:
        print(f"Error checking Countries: {e}")

    try:
        print(f"VisaApplication count: {VisaApplication.objects.count()}")
    except Exception as e:
        print(f"Error checking VisaApplications: {e}")

if __name__ == "__main__":
    run()
