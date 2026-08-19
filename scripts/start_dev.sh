#!/usr/bin/env bash
cd "$(dirname "$0")/.."

echo "==================================================="
echo "  Goimomi Holidays - Local Development Launcher"
echo "==================================================="
echo ""

echo "Launching Django Backend on http://127.0.0.1:8000 ..."
(cd goimomibackend && python manage.py runserver 0.0.0.0:8000) &

echo "Launching React Frontend on http://localhost:5174 ..."
(cd goimomifrontend && npm run dev) &

wait
