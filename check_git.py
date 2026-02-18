
import paramiko
import os

hostname = "172.203.209.87"
username = "dcxworks"
password = "DCXServer321$"

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password)

    project_dir = "/home/dcxworks/goimomi"
    print(f"Checking {project_dir}...")
    
    # Check if .git exists
    stdin, stdout, stderr = ssh.exec_command(f"ls -la {project_dir}")
    print("\nContents:")
    for line in stdout:
        print(line.strip())

    ssh.close()
except Exception as e:
    print(f"Error: {e}")
