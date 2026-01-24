import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from Holidays.models import Visa

def test():
    try:
        v = Visa.objects.first()
        if v:
            print(f"Visa ID: {v.id}")
            for field in v._meta.fields:
                print(f"Field: {field.name}")
        else:
            print("No visas found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
