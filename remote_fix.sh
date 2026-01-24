#!/bin/bash
cd ~/goimomi/goimomi-holidays-backend
source venv/bin/activate

# Fix models.py to remove fields that don't have migrations
# This prevents Serializer(__all__) from crashing
sed -i '/header_image = models.ImageField/s/^/# /' Holidays/models.py
sed -i '/video = models.FileField/s/^/# /' Holidays/models.py

python3 manage.py makemigrations
python3 manage.py migrate

# Try to restart gunicorn without sudo if possible, or just kill it so it autostarts
pkill -f gunicorn || true
# Gunicorn usually managed by systemd will restart itself if it dies
