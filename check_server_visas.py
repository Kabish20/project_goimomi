from Holidays.models import Visa
print("---SERVER VISAS---")
for v in Visa.objects.all():
    print(f"ID:{v.id} | Title:{v.title} | Validity:'{v.validity}' | Duration:'{v.duration}'")
print("---END---")
