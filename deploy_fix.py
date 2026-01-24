import os
import subprocess
import getpass

# Configuration
SERVER_IP = "172.203.209.87"
SERVER_USER = "dcxworks"
SERVER_PASSWORD = "DCXServer321$"
REMOTE_PATH = "/home/dcxworks/goimomi/goimomi-holidays-backend"

def run_local(cmd):
    print(f"Executing: {cmd}")
    subprocess.run(cmd, shell=True)

def run_remote_sudo(command):
    # This uses echo pass | sudo -S command
    full_cmd = f"ssh -o StrictHostKeyChecking=no {SERVER_USER}@{SERVER_IP} \"echo {SERVER_PASSWORD} | sudo -S {command}\""
    print(f"Executing Remote Sudo: {command}")
    # We need to provide the SSH password too
    # Using sshpass if available, but here we can try sending it to stdin if we use run_command
    # For now, let's use the tool's ability to send input if needed, but let's try a single-line sudo first.
    return full_cmd

def main():
    # 1. Sync files
    files = [
        "Holidays/models.py",
        "Holidays/serializers.py",
        "Holidays/views.py"
    ]
    
    for f in files:
        run_local(f"scp -o StrictHostKeyChecking=no goimomi-holidays-backend/{f} {SERVER_USER}@{SERVER_IP}:{REMOTE_PATH}/{f}")
    
    # 2. Run migrations and restart
    remote_script = f"""
    source {REMOTE_PATH}/venv/bin/activate
    cd {REMOTE_PATH}
    python3 manage.py makemigrations
    python3 manage.py migrate
    echo {SERVER_PASSWORD} | sudo -S systemctl restart gunicorn
    """
    
    # We'll run this via SSH
    # I'll output the steps so I can run them with run_command and send_command_input
    print("Files synced. Now run the migrations and restart.")

if __name__ == "__main__":
    main()
