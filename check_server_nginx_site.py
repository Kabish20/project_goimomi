
import paramiko

hostname = "172.203.209.87"
username = "dcxworks"
password = "DCXServer321$"

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password)
    
    command = "cat /etc/nginx/sites-enabled/goimomi-frontend"
    stdin, stdout, stderr = ssh.exec_command(command)
    print("Nginx Site Config:")
    for line in stdout:
        print(line.strip())

    ssh.close()
except Exception as e:
    print(f"Error: {e}")
