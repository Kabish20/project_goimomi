#!/bin/bash
cd /home/ubuntu
unzip -o update_package.zip -d update_temp
# Sync backend - preserve venv if possible, but the zip doesn't have it
cp -r update_temp/goimomi-holidays-backend/* project/goimomi-holidays-backend/
# Sync frontend
cp -r update_temp/goimomi-holidays-frontend/* project/goimomi-holidays-frontend/

# Update paths in restore script for the correct project folder
sed -i 's|project_goimomi|project|g' project/goimomi-holidays-backend/restore_itineraries.py

# Migrations
cd /home/ubuntu/project/goimomi-holidays-backend
./venv/bin/python manage.py migrate

# Restore data
./venv/bin/python restore_itineraries.py

# Build Frontend
cd /home/ubuntu/project/goimomi-holidays-frontend
npm install
npm run build

# Restart Backend
sudo systemctl restart goimomi
sudo systemctl restart nginx
echo "Deployment to LIVE project Complete!"
