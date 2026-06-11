unzip -o update_package.zip -d /home/ubuntu/goimomi
cd /home/ubuntu/goimomi/goimomi-holidays-backend

# Update ALLOWED_HOSTS
sed -i 's/^ALLOWED_HOSTS=.*/ALLOWED_HOSTS=54.81.116.105,localhost,127.0.0.1,goimomi.com,www.goimomi.com/' .env

# Restart backend
source venv/bin/activate
python manage.py collectstatic --noinput
sudo systemctl restart goimomi

# Build frontend
cd ../goimomi-holidays-frontend
npm install
npm run build
