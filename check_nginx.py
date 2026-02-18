
import paramiko
import time

hostname = "172.203.209.87"
username = "dcxworks"
password = "DCXServer321$"

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password)
    
    # Check enabled sites
    command = "ls -la /etc/nginx/sites-enabled/"
    stdin, stdout, stderr = ssh.exec_command(command)
    print("Enabled sites:")
    for line in stdout:
        print(line.strip())
        
    # Read default site config (or goimomi if separate)
    # Trying default first
    command = "cat /etc/nginx/sites-enabled/default"
    stdin, stdout, stderr = ssh.exec_command(command)
    print("\nDefault Site Config:")
    for line in stdout:
        print(line.strip())

    ssh.close()
except Exception as e:
    print(f"Error: {e}")
