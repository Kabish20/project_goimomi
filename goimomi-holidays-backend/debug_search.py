from Holidays.models import VehicleRateCard, VehicleMaster
import datetime
p_date = datetime.date(2026, 3, 10)
from_city = 'Jeddah SAUDI ARABIA'
to_city = 'Jeddah SAUDI ARABIA'
rcs = VehicleRateCard.objects.all() # Check all to see what matches
print(f"Checking {rcs.count()} total cards for date {p_date} and cities {from_city} -> {to_city}")
for rc in rcs:
    date_ok = rc.validity_start <= p_date <= rc.validity_end
    print(f"Card {rc.id} - {rc.name} (Range: {rc.validity_start} to {rc.validity_end}). Date OK? {date_ok}")
    for r in rc.routes:
        rf = str(r.get('start_city', '')).strip().lower()
        rt = str(r.get('drop_city', '')).strip().lower()
        route_ok = (rf in from_city.lower()) or (from_city.lower() in rf)
        if route_ok: print(f"  Route PARTIAL match: {rf} -> {rt}")
        if rf == from_city.lower() and rt == to_city.lower():
            print(f"  EXACT Match on Route! Headers: {rc.column_vehicles}")
