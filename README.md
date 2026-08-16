# AnnaSetu (अन्नसेतु) — AI-Based Food Redistribution & Surplus Management Platform

> *"Bridging Surplus. Ending Hunger."*

AnnaSetu is an AI-powered Progressive Web Application (PWA) that connects food-surplus businesses (bakeries, restaurants, supermarkets) with NGOs, individuals, and delivery partners to eliminate food waste and fight hunger.

---

## 🌟 Key Features

1. **5 Role-Based Dashboards**:
   - **Business Dashboard**: Inventory management, AI expiry urgency alerts, real-time camera barcode scanner, CSV bulk upload, donation creation, nearby NGOs map, transaction logs.
   - **NGO Dashboard**: Browse available donations, AI match scoring, accept donations, schedule pickup dates, manage beneficiary headcount, view donation history & reports.
   - **Individual Dashboard**: Browse free food surplus nearby, claim donations, view claim history.
   - **Delivery Dashboard**: View available pickup tasks, active delivery navigation, OTP-authenticated food dropoff verification.
   - **Admin Dashboard**: System-wide user management, donation audit logs, delivery tracking, broadcast notification alerts, category reports.

2. **AI & Automation**:
   - **OpenFoodFacts Barcode Lookup**: Scan barcode via camera to instantly auto-fill product details.
   - **AI Surplus Prediction**: Calculates item urgency scores (0-100%) based on expiry dates.
   - **AI Matching**: Ranks donations for NGOs based on capacity and distance.

3. **Delivery OTP Authentication**:
   - Deliveries require a 6-digit OTP provided by recipient NGOs/individuals to confirm food arrival and update all dashboards in real time.

4. **Multilingual (i18n)**:
   - Full UI support for **English**, **हिन्दी (Hindi)**, **தமிழ் (Tamil)**, and **తెలుగు (Telugu)**.

5. **Progressive Web App (PWA)**:
   - Mobile-first responsive design, offline caching, Add to Home Screen support.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+

### Step 1: Start Backend (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python -c "from app.seed import seed_db; seed_db()"
uvicorn app.main:app --reload --port 8000
```

### Step 2: Start Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:5173`** in your browser.

## 🌐 Live Demo

**Application URL:**  
https://ai-food-redistribution-system.vercel.app

Or click here:  
[🚀 AI Food Redistribution System](https://ai-food-redistribution-system.vercel.app)

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
|---|---|---|
| Business | `business@annasetu.org` | `password123` |
| NGO | `ngo@annasetu.org` | `password123` |
| Individual | `individual@annasetu.org` | `password123` |
| Delivery | `delivery@annasetu.org` | `password123` |
| Admin | `admin@annasetu.org` | `password123` |

---

## 📁 Project Architecture

```
Annasetu/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routers (auth, business, ngo, delivery, admin)
│   │   ├── core/         # DB connection, security (JWT), config
│   │   ├── models/       # SQLAlchemy ORM models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # AI prediction, barcode, OTP services
│   │   ├── main.py       # FastAPI application
│   │   └── seed.py       # DB seeder
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/          # Axios instance with auto JWT refresh
    │   ├── components/   # MapView, BarcodeScanner, OTPModal, TopBar, Sidebar
    │   ├── contexts/     # AuthContext
    │   ├── i18n/         # EN, HI, TA, TE translations
    │   ├── pages/        # Business, NGO, Individual, Delivery, Admin pages
    │   └── App.jsx
    └── vite.config.js    # PWA configuration
```
