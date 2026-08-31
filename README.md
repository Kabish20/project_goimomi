# 🌍 Goimomi Holidays

## Full-Stack Travel Booking & Holiday Management Platform

**Live Website:** https://goimomi.com/

---

## ⚡ Quick Start & Development Workflow

Start both the backend REST API and React frontend dev server effortlessly:

### Windows:
Run the one-click local development launcher:
```cmd
start_dev.bat
```

### Linux / macOS:
```bash
chmod +x start_dev.sh
./start_dev.sh
```

### Workspace npm Commands:
```bash
npm run dev             # Launch both servers via start_dev script
npm run dev:backend     # Start Django API server (port 8000)
npm run dev:frontend    # Start React Vite dev server (port 5174)
npm run build:frontend  # Build production frontend dist bundle
npm run check:backend   # Run backend system checks
npm run test:backend    # Run Django unit tests
npm run lint:frontend   # Run ESLint frontend checks
npm run seed:visas      # Seed visa data in backend
npm run seed:logistics  # Seed courier tracking providers
npm run zip:package     # Build deployment package archive
```

---

## 📂 Workspace Structure & Organization

```text
goimomi-workspace/
├── scripts/                          # Central workspace scripts
│   ├── start_dev.bat                 # Development launcher (Windows)
│   ├── start_dev.sh                  # Development launcher (Linux/macOS)
│   ├── create_zip.py                 # Deployment zip packager
│   ├── backup_db.sh                  # Database & media backup script
│   └── update_server.sh              # Remote server update & deployment script
│
├── goimomifrontend/                  # React + Vite Frontend
│   ├── src/
│   │   ├── assets/                   # Images, icons, and graphic assets
│   │   │   └── visa-deals/           # Visa deals promotional banners
│   │   ├── components/               # UI Components
│   │   │   ├── common/               # Shared components (Modals, Scroll, ErrorBoundary)
│   │   │   ├── layout/               # Global layout (Navbar, Footer)
│   │   │   ├── forms/                # Form & enquiry components
│   │   │   ├── holidays/             # Holiday package cards & modals
│   │   │   └── admin/                # Admin dashboard components
│   │   ├── pages/                    # Page components (Visa, Umrah, Holidays, etc.)
│   │   ├── utils/                    # Utility functions, parsers & helpers
│   │   ├── hooks/                    # Custom React hooks (SEO, etc.)
│   │   ├── App.jsx                   # Main React routing component
│   │   └── main.jsx                  # React entry point
│   ├── public/                       # Static public assets
│   ├── package.json                  # Frontend dependencies & scripts
│   └── vite.config.js                # Vite build configuration
│
├── goimomibackend/                   # Django REST Backend
│   ├── backend/                      # Django core settings & WSGI/ASGI
│   ├── Holidays/                     # Primary Django app (Models, Views, Serializers)
│   │   ├── management/commands/      # Custom Django management commands
│   │   ├── migrations/               # Database migrations
│   │   ├── services/                 # Payment & API integration services
│   │   ├── static/                   # Static assets (logos, payment QR)
│   │   └── templates/                # Email & PDF voucher HTML templates
│   ├── scripts/                      # Backend utility & seed scripts
│   │   ├── seed_logistics.py         # Seed courier logistics providers
│   │   ├── seed_popular_visas.py     # Seed popular visa packages
│   │   ├── seed_v_z_visas.py         # Seed additional country visa data
│   │   └── generate_refresh_token.py # Generate Zoho API refresh tokens
│   ├── manage.py                     # Django CLI utility
│   ├── requirements.txt              # Python dependencies
│   ├── README.md                     # Backend setup documentation
│   └── .env.example                  # Backend environment template
│
├── .env.example                      # Root environment template
├── start_dev.bat                     # Convenience launcher wrapper (Windows)
├── start_dev.sh                      # Convenience launcher wrapper (Linux/macOS)
├── package.json                      # Workspace root NPM configuration
└── README.md                         # Project documentation
```

---

## ✈️ About Goimomi Holidays

**Goimomi Holidays** is a full-stack travel and holiday management platform developed to provide customers with a seamless digital experience for discovering destinations, exploring curated holiday packages, finding travel services, booking cabs, applying for visas, and submitting travel enquiries.

The platform combines a **modern React-based frontend** with a **scalable Django REST API backend and PostgreSQL database**, creating a structured architecture capable of supporting real-world travel operations and future business expansion.

---

# 🎯 Project Objective

The primary objective of Goimomi Holidays is to provide a centralized and user-friendly digital platform that simplifies the holiday planning, cab booking, visa processing, and travel enquiry process.

The application is designed to:

* Showcase domestic and international holiday destinations
* Display curated and customizable holiday packages
* Provide detailed visa application assistance and tracking
* Support cab and airport transfer bookings with automated voucher & PDF invoice generation
* Allow customers to submit travel enquiries
* Dynamically manage content through backend APIs
* Maintain structured travel and customer information
* Provide administrators with centralized data management capabilities

---

# 🏗️ System Architecture

The application follows a modern **client-server architecture**:

```text
┌──────────────────────────────┐
│        React Frontend        │
│   Vite + Tailwind CSS + JS   │
└──────────────┬───────────────┘
               │
               │ HTTPS / REST API
               ▼
┌──────────────────────────────┐
│       Django REST API        │
│ Django REST Framework (DRF)  │
└──────────────┬───────────────┘
               │
               │ ORM / Queries
               ▼
┌──────────────────────────────┐
│         PostgreSQL           │
│      Relational Database     │
└──────────────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend
* **React.js** (Vite)
* **JavaScript (ES6+)**
* **Tailwind CSS / Vanilla CSS**
* **Axios** (REST API Client)

## Backend
* **Python 3.13**
* **Django & Django REST Framework (DRF)**
* **xhtml2pdf / Pisa** (PDF Voucher & Invoice Generation)
* **Twilio API & Zoho Payments / CRM Integration**

## Database
* **PostgreSQL / SQLite3** (Development)

---

# ⚙️ Installation & Development Setup

## 1. Clone the Repository

```bash
git clone <repository-url>
cd goimomi-workspace
```

## 2. Backend Setup

```bash
cd goimomibackend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 3. Frontend Setup

```bash
cd goimomifrontend
npm install
npm run dev
```

---

# 🔒 Security Practices

* Environment-based credential management (`.env`)
* Protected API endpoints with CORS and token verification
* Input validation on Django REST serializers
* HTTPS & SSL encryption in production

---

# 🌐 Live Application

The production application is live at: **https://goimomi.com/**

---

## 🌍 Goimomi Holidays
**Explore. Plan. Travel.**
