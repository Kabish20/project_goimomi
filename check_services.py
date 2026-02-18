
import paramiko

hostname = "172.203.209.87"
username = "dcxworks"
password = "DCXServer321$"

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password)
    
    print("Running Python processes:")
    stdin, stdout, stderr = ssh.exec_command("ps aux | grep python")
    for line in stdout:
        print(line.strip())

    print("\nRunning Node processes:")
    stdin, stdout, stderr = ssh.exec_command("ps aux | grep node")
    for line in stdout:
        print(line.strip())
        
    print("\nSystemd services:")
    stdin, stdout, stderr = ssh.exec_command("systemctl list-units --type=service | grep -i goimomi")
    for line in stdout:
        print(line.strip())

    ssh.close()
except Exception as e:
    print(f"Error: {e}")
