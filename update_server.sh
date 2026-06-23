unzip -o update_package.zip -d /home/ubuntu/goimomi
cd /home/ubuntu/goimomi/goimomi-holidays-backend

# Update ALLOWED_HOSTS and DB_PASSWORD
sed -i 's/^ALLOWED_HOSTS=.*/ALLOWED_HOSTS=54.81.116.105,localhost,127.0.0.1,goimomi.com,www.goimomi.com/' .env
sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD="DCXServer321$"/' .env

# Restart backend
source venv/bin/activate
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py fix_vehicle_images
python manage.py fix_package_images
sudo systemctl restart goimomi

# Build frontend
cd ../goimomi-holidays-frontend
npm install
npm run build
