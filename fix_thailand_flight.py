
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from Holidays.models import HolidayPackage

# Find Thailand packages
thailand_pkgs = HolidayPackage.objects.filter(title__icontains='Thailand')
print(f"Found {thailand_pkgs.count()} Thailand packages.")

for pkg in thailand_pkgs:
    print(f"Updating '{pkg.title}' (ID: {pkg.id}) to have with_flight=True")
    pkg.with_flight = True
    pkg.save()

print("Done.")
