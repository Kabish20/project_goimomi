import os
import django
from django.db import connection

# Setup Django if run standalone
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

def run():
    print("Checking tables...")
    tables = connection.introspection.table_names()
    print("All tables:", tables)
    
    # Check for variants
    candidates = [t for t in tables if 'visa' in t.lower()]
    print("Visa-like tables:", candidates)

if __name__ == "__main__":
    run()
