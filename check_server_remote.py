
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
    print(f"Checking remotes in {project_dir}...")
    
    stdin, stdout, stderr = ssh.exec_command(f"cd {project_dir} && git remote -v")
    print("\nRemotes:")
    for line in stdout:
        print(line.strip())

    ssh.close()
except Exception as e:
    print(f"Error: {e}")
