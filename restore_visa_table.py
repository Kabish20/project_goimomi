import os
import django
from django.db import connection, models

# Setup Django if run standalone
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from Holidays.models import Visa

def run():
    print("Checking if Visa table exists...")
    tables = connection.introspection.table_names()
    if 'Holidays_visa' in tables:
        print("Table 'Holidays_visa' already exists.")
        return

    print("Creating 'Holidays_visa' table manually...")

    # We define a temporary model that matches the schema at migration 0052
    # i.e., NO card_image, NO header_image, NO video.
    class VisaRestore(models.Model):
        country = models.CharField(max_length=100)
        title = models.CharField(max_length=200)
        entry_type = models.CharField(max_length=50, default="Single-Entry Visa")
        validity = models.CharField(max_length=50, default="30 days")
        duration = models.CharField(max_length=50, default="30 days")
        processing_time = models.CharField(max_length=100)
        price = models.IntegerField()
        documents_required = models.TextField(blank=True)
        photography_required = models.TextField(blank=True)
        visa_type = models.CharField(max_length=100, default='✈️ Tourist Visa')
        is_active = models.BooleanField(default=True)
        created_at = models.DateTimeField(auto_now_add=True)

        class Meta:
            app_label = 'Holidays'
            db_table = 'Holidays_visa'
            managed = False  # Prevent Django from trying to manage it normally here

    with connection.schema_editor() as schema_editor:
        schema_editor.create_model(VisaRestore)
    
    print("Table 'Holidays_visa' created matching migration 0052 state.")

if __name__ == "__main__":
    run()
