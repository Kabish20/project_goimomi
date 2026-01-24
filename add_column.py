import os
import django
from django.db import connection

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

def run():
    print("Adding card_image column...")
    with connection.cursor() as cursor:
        try:
            cursor.execute('ALTER TABLE "Holidays_visa" ADD COLUMN "card_image" varchar(100);')
            print("Column 'card_image' added successfully.")
        except Exception as e:
            print(f"Error adding column: {e}")

if __name__ == "__main__":
    run()
