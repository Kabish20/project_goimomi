import os
import subprocess

def run(cmd):
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"ERROR: {result.stderr}")
    else:
        print(result.stdout)

def main():
    os.chdir("/home/dcxworks/goimomi/goimomi-holidays-backend")
    run("source venv/bin/activate && python3 manage.py makemigrations Holidays")
    run("source venv/bin/activate && python3 manage.py migrate Holidays")
    run("pkill -f gunicorn")
    print("Done. Gunicorn killed, should auto-restart.")

if __name__ == "__main__":
    main()
