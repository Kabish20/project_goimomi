
import paramiko
import os

hostname = "172.203.209.87"
username = "dcxworks"
password = "DCXServer321$"

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password)

    print("Connected to server.")
    
    # List home directory contents
    stdin, stdout, stderr = ssh.exec_command("ls -la ~")
    print("\nHome directory contents:")
    for line in stdout:
        print(line.strip())

    # Check for goimomi project
    stdin, stdout, stderr = ssh.exec_command("find ~ -name 'goimomi*' -type d -maxdepth 2")
    print("\nPossible project directories:")
    for line in stdout:
        print(line.strip())

    ssh.close()
except Exception as e:
    print(f"Error: {e}")
