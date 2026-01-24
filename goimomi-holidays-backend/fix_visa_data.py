import os, django, sys
# No need to append sys.path if we run it from the root directory with the right environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from Holidays.models import Visa

print('--- INVESTIGATING VISAS ---')
all_visas = Visa.objects.all()
for v in all_visas:
    print(f'ID:{v.id} | Country:\"{v.country}\" | Title:\"{v.title}\" | Valid:\"{v.validity}\" | Dur:\"{v.duration}\"')

print('--- FIXING EMPTY FIELDS ---')
updated_count = 0
for v in all_visas:
    changed = False
    if not v.validity:
        v.validity = '30 days'
        changed = True
    if not v.duration:
        v.duration = '30 days'
        changed = True
    if changed:
        v.save()
        updated_count += 1
print(f'Updated {updated_count} visas with default validity/duration.')

print('--- CHECKING FOR WRONG COUNTRY (USA vs UAE) ---')
wrong_usas = Visa.objects.filter(country__icontains='States', title__icontains='Dubai')
if wrong_usas.exists():
    print(f'Found {wrong_usas.count()} visas with USA country but Dubai title. Fixing...')
    for v in wrong_usas:
        v.country = 'United Arab Emirates'
        v.save()
        print(f'Fixed ID:{v.id}')
else:
    print('No USA/Dubai mismatches found.')
