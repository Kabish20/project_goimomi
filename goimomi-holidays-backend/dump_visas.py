from Holidays.models import Visa

with open('visas_dump.txt', 'w', encoding='utf-8') as f:
    for v in Visa.objects.all():
        f.write(f"ID:{v.id} | Title:{v.title} | Price:{v.price} | Validity: '{v.validity}' | Duration: '{v.duration}'\n")
