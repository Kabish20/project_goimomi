# Goimomi Backend

Django REST API backend for the Goimomi Holidays platform.

## Tech Stack

- **Python 3.13** + **Django 4.2** + **Django REST Framework**
- **PostgreSQL** (production) / **SQLite3** (development)
- **Celery** + **Redis** for async tasks
- **xhtml2pdf / ReportLab** for PDF generation
- **Zoho CRM & Payments** integration
- **Brevo SMTP** for transactional emails

## Setup

```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver 0.0.0.0:8000
```

## Project Structure

```
goimomibackend/
├── backend/                    # Django project settings
│   ├── settings.py             # Main configuration
│   ├── urls.py                 # Root URL routing
│   ├── wsgi.py / asgi.py       # WSGI/ASGI entry points
│   └── celery.py               # Celery configuration
│
├── Holidays/                   # Primary Django app
│   ├── models.py               # Database models
│   ├── views.py                # API views
│   ├── serializers.py          # DRF serializers
│   ├── urls.py                 # App URL routing
│   ├── admin.py                # Django admin config
│   ├── utils.py                # Utility functions (PDF, email)
│   ├── tasks.py                # Celery async tasks
│   ├── services/               # External API integrations
│   │   └── zoho_payment.py     # Zoho Payments service
│   ├── management/commands/    # Custom Django management commands
│   ├── migrations/             # Database migrations
│   ├── templates/emails/       # HTML email templates
│   └── static/                 # Static files (logos, images)
│
├── scripts/                    # Utility & seed scripts
├── media/                      # User-uploaded files (gitignored)
├── manage.py                   # Django CLI
├── requirements.txt            # Python dependencies
├── .env.example                # Environment template
└── .env                        # Environment variables (gitignored)
```

## Management Commands

```bash
python manage.py populate_countries       # Seed country data
python manage.py populate_visa_data       # Seed visa data
python manage.py seed_airports            # Seed airport data
python manage.py seed_sightseeing         # Seed sightseeing data
python manage.py populate_starting_cities # Seed starting cities
```

## Seed Scripts

```bash
python scripts/seed_logistics.py      # Seed courier/logistics providers
python scripts/seed_popular_visas.py  # Seed popular visa packages
python scripts/seed_v_z_visas.py      # Seed additional visa data
```
