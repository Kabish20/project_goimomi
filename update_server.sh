unzip -o update_package.zip -d /home/ubuntu/goimomi
cd /home/ubuntu/goimomi/goimomibackend

# Update ALLOWED_HOSTS and DB_PASSWORD
python3 -c "import os; p = '.env'; c = open(p).read(); open(p, 'w').write(c.replace('DB_PASSWORD=Goimomi@123', 'DB_PASSWORD=\"DCXServer321$\"').replace('DEBUG=True', 'DEBUG=False'))"
cp .env /home/ubuntu/.env

# Restart backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py fix_vehicle_images
python manage.py fix_package_images
sudo systemctl restart goimomi

# Build frontend
cd ../goimomifrontend
npm install
npm run build
