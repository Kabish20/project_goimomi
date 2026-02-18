
import paramiko
import os

hostname = "172.203.209.87"
username = "dcxworks"
password = "DCXServer321$"

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password)
    
    sftp = ssh.open_sftp()
    
    remote_path = "/home/dcxworks/goimomi/goimomi-holidays-backend/goimomi_holidays/settings.py" # Guessing path based on project name, usually inner dir same as project name or 'backend'
    # Actually, let's list the backend dir first to find where settings.py is.
    stdin, stdout, stderr = ssh.exec_command("find /home/dcxworks/goimomi/goimomi-holidays-backend -name settings.py")
    paths = stdout.read().decode().strip().split('\n')
    
    if paths and paths[0]:
        remote_path = paths[0]
        print(f"Found settings.py at {remote_path}")
        local_path = "server_settings.py"
        sftp.get(remote_path, local_path)
        print(f"Downloaded to {local_path}")
    else:
        print("settings.py not found on server")

    sftp.close()
    ssh.close()
except Exception as e:
    print(f"Error: {e}")
