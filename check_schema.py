import os
import django
from django.db import connection

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

def run():
    with connection.cursor() as cursor:
        for table in ['Holidays_visa', 'Holidays_visaapplication']:
            print(f"\n--- Columns in {table} ---")
            cursor.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table}' ORDER BY column_name;")
            columns = cursor.fetchall()
            for col in columns:
                print(f"  {col[0]}: {col[1]}")

if __name__ == "__main__":
    run()
