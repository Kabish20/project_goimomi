import os
import django
import json

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from Holidays.models import Visa
from Holidays.serializers import VisaSerializer

def test():
    print("Starting serialization test...")
    try:
        visas = Visa.objects.all()
        print(f"Found {visas.count()} visas.")
        for v in visas:
            try:
                data = VisaSerializer(v).data
                # print(f"Successfully serialized ID:{v.id}")
            except Exception as e:
                print(f"FAILED to serialize ID:{v.id}")
                print(f"Error: {e}")
                import traceback
                traceback.print_exc()
        print("Test complete.")
    except Exception as e:
        print(f"Global error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()
