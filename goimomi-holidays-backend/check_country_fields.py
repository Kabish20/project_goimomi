import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from Holidays.models import Country

def test():
    try:
        c = Country.objects.first()
        if c:
            print(f"Country ID: {c.id}")
            for field in c._meta.fields:
                print(f"Field: {field.name}")
        else:
            print("No countries found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
