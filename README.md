# Store Rating System

This is my submission for the internship assignment. It is a full-stack monorepo application where shoppers can search and rate physical stores, store owners can view metrics/reviews of their stores, and admins can manage stores and users.

## Live Links
* **Frontend Web App**: [https://storeratingsys.vercel.app/](https://storeratingsys.vercel.app/)
* **Backend API**: [https://storeratingsys.onrender.com/](https://storeratingsys.onrender.com/)

## Quick Demo Credentials
* **System Admin**: `admin@storerating.com` / `Password123!`
* **Store Owner**: `owner1@storerating.com` / `Password123!`
* **Shopper (Normal User)**: `user1@storerating.com` / `Password123!`
*(The login page features a Quick Autofill panel to let you log in instantly with these accounts).*

---

## Technical Highlights
* **Dual Database Modes**: Configured to run against remote Supabase PostgreSQL in production, falling back to local SQLite (`store_rating.sqlite`) for instant local testing.
* **Keep-Alive Cron**: A GitHub Actions workflow (`keep-alive.yml`) pings the backend `/api/health` endpoint every 14 minutes to prevent Render's free tier from sleeping.
* **Minimalist Design**: Minimalist monochrome theme using vanilla CSS, with full SPA routing rewrites handled on Vercel to support page refreshing.

---

## How to Run Locally

### 1. Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install --include=dev
```

### 2. Seed Database (Creates local SQLite database with test profiles)
```bash
cd ../backend && npm run seed
```

### 3. Run Servers
* Backend: `npm run dev` in `backend/` (runs on http://localhost:5000)
* Frontend: `npm run dev` in `frontend/` (runs on http://localhost:5173)
