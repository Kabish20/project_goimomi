
import paramiko
import time

hostname = "172.203.209.87"
username = "dcxworks"
password = "DCXServer321$"

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password)
    
    # Read service file
    # Trying cat with sudo -S
    command = "sudo -S cat /etc/systemd/system/goimomi.service"
    stdin, stdout, stderr = ssh.exec_command(command)
    stdin.write(password + '\n')
    stdin.flush()
    
    print("Service File Content:")
    for line in stdout:
        print(line.strip())
        
    for line in stderr:
        # Filter out password prompt/sudo lecture
        if "password" not in line.lower():
            print("Stderr: " + line.strip())

    ssh.close()
except Exception as e:
    print(f"Error: {e}")
