from Holidays.models import Visa
import json

visas = Visa.objects.all()
data = []
for v in visas:
    data.append({
        "id": v.id,
        "title": v.title,
        "validity": v.validity,
        "duration": v.duration,
        "country": v.country
    })

print(json.dumps(data, indent=2))
