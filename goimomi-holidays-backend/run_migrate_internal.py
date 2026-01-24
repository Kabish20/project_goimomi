import os
import subprocess
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.core.management import call_command

def run():
    print("Running makemigrations...")
    try:
        call_command('makemigrations')
        print("Running migrate...")
        call_command('migrate')
        print("Migrations complete.")
    except Exception as e:
        print(f"Migration Error: {e}")

if __name__ == "__main__":
    run()
