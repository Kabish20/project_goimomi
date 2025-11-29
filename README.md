🌍 Goimomi — Travel Agency Website

A complete Django-based travel agency platform providing customers with a seamless way to explore destinations, make inquiries, book services, and receive confirmations. The project is structured for deployment and includes templates, static file management, REST configurations, and production-ready settings.

📂 Project Structure
goimomi/
│
├── env/                     # Python virtual environment (ignored in git)
│
├── goimomi/                 # Main Django project directory
│   ├── templates/           # HTML templates
│   │   ├── aboutus.html
│   │   ├── Cancellation Policy.html
│   │   ├── contact_success.html
│   │   ├── contactus.html
│   │   ├── customize_trip.html
│   │   ├── customize_trip_success.html
│   │   ├── home.html
│   │   ├── privacy policy.html
│   │   └── Terms & Conditions.html
│   │
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py          # Django project settings
│   ├── urls.py              # URL routing
│   └── wsgi.py              # WSGI entry point for production
│
├── goimomiapp/              # Main application module
│
├── static/                  # Static files (CSS, JS, images)
│
├── staticfiles/             # Collected static files for production
│
├── db.sqlite3               # Local development database
├── manage.py
├── builder.config.json
├── TODO.md
├── requirements.txt
└── .gitignore

🚀 Features
🗺️ Frontend Pages

Home Page

About Us

Contact Form (with success page)

Customize Trip Form

Privacy Policy

Terms & Conditions

Cancellation Policy

⚙️ Backend (Django)

Django URL routing and views

Template rendering

Static files support

Form handling + success notifications

SQLite database for local development

Production-ready WSGI support

Organized template and static folder structure

🛠️ Technologies Used
Technology	Purpose
Python 3	Backend language
Django	Web framework
HTML, CSS, JS	Frontend templates
SQLite3	Development database
Nginx / Apache (optional)	Deployment server
Gunicorn	WSGI application server
▶️ Getting Started
1️⃣ Clone the Repository
git clone https://github.com/Kabish20/project_goimomi.git
cd project_goimomi

2️⃣ Create Virtual Environment
python -m venv env
source env/bin/activate       # Linux/Mac
env\Scripts\activate          # Windows

3️⃣ Install Dependencies
pip install -r requirements.txt

4️⃣ Run Migrations
python manage.py migrate

5️⃣ Start Development Server
python manage.py runserver

📦 Deployment Instructions (Short)
Collect Static Files
python manage.py collectstatic

Using Gunicorn + Nginx

Configure Gunicorn service

Point Nginx to unix:/run/gunicorn.sock;

Ensure no conflict with Apache on port 80

Restart both services

📘 Future Improvements

Add API endpoints for bookings

Add authentication and login

Admin dashboard for managing travel packages

Payment gateway integration

Mobile-friendly UI revamp
