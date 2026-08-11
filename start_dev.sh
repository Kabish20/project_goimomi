#!/usr/bin/env bash

echo "==================================================="
echo "  Goimomi Holidays - Local Development Launcher"
echo "==================================================="
echo ""

echo "Launching Django Backend on http://127.0.0.1:8000 ..."
(cd goimomi-holidays-backend && python manage.py runserver 0.0.0.0:8000) &

echo "Launching React Frontend on http://localhost:5174 ..."
(cd goimomi-holidays-frontend && npm run dev) &

wait
