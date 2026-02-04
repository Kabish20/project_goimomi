import paramiko
import os

hostname = "172.203.209.87"
username = "dcxworks"
password = "DCXServer321$"

def deploy():
    try:
        # 1. Connect
        print(f"Connecting to {hostname}...")
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname, username=username, password=password)
        
        sftp = ssh.open_sftp()
        
        # 2. Upload
        print("Checking update files...")
        backend_exists = os.path.exists("d:\\G\\backend.tar.gz")
        frontend_exists = os.path.exists("d:\\G\\frontend.tar.gz")
        
        if backend_exists:
            print("Uploading backend.tar.gz...")
            sftp.put("d:\\G\\backend.tar.gz", "/home/dcxworks/goimomi/backend_update.tar.gz")
        else:
            print("backend.tar.gz not found, skipping backend upload.")
            
        if frontend_exists:
            print("Uploading frontend.tar.gz...")
            sftp.put("d:\\G\\frontend.tar.gz", "/home/dcxworks/goimomi/frontend_update.tar.gz")
        else:
            print("frontend.tar.gz not found!")
            if not backend_exists:
                print("No update files found. Exiting.")
                return
        
        sftp.close()
        
        # 3. Deploy on server
        print("Executing deployment commands on server...")
        
        commands = []
        if backend_exists:
            commands.extend([
                # Backup backend
                "cd /home/dcxworks/goimomi && cp -r goimomi-holidays-backend goimomi-holidays-backend.backup.$(date +%Y%m%d_%H%M%S)",
                # Extract backend (overwrite files)
                "cd /home/dcxworks/goimomi && tar -xzf backend_update.tar.gz",
                # Run migrations
                "cd /home/dcxworks/goimomi/goimomi-holidays-backend && ./venv/bin/python manage.py migrate",
            ])
            
        if frontend_exists:
            commands.extend([
                # Backup frontend dist
                "cd /home/dcxworks/goimomi/goimomi-holidays-frontend && mkdir -p dist_backup && mv dist dist_backup/dist.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true",
                # Extract frontend
                "mkdir -p /home/dcxworks/goimomi/goimomi-holidays-frontend/dist",
                "cd /home/dcxworks/goimomi/goimomi-holidays-frontend/dist && tar -xzf /home/dcxworks/goimomi/frontend_update.tar.gz",
                # Sync to /var/www/html
                "echo 'DCXServer321$' | sudo -S cp -r /home/dcxworks/goimomi/goimomi-holidays-frontend/dist/* /var/www/html/",
            ])
            
        # Common commands
        commands.extend([
            # Restart services
            "echo 'DCXServer321$' | sudo -S systemctl restart goimomi-backend",
            "echo 'DCXServer321$' | sudo -S systemctl restart nginx",
        ])
        
        for cmd in commands:
            print(f"Running: {cmd}")
            stdin, stdout, stderr = ssh.exec_command(cmd)
            out = stdout.read().decode()
            err = stderr.read().decode()
            if out: print(out)
            if err: print(f"Output/Error: {err}")
            
        ssh.close()
        print("Deployment completed successfully!")
        
    except Exception as e:
        print(f"Deployment failed: {e}")

if __name__ == "__main__":
    deploy()
