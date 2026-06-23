from Holidays.models import CabBooking

print("=== BACKFILLING BOOKING IDs ===")
updated = 0
for b in CabBooking.objects.filter(booking_id__isnull=True).order_by('id'):
    new_id = 'GO-TRN-' + str(b.pk).zfill(4)
    CabBooking.objects.filter(pk=b.pk).update(booking_id=new_id)
    print('  ID=' + str(b.id) + ' -> ' + new_id)
    updated += 1

print('Done. Updated: ' + str(updated))
print('')
print("=== ALL BOOKINGS ===")
for b in CabBooking.objects.all().order_by('id'):
    print('  ID=' + str(b.id) + ' | ' + str(b.booking_id) + ' | ' + b.first_name + ' ' + b.last_name)
