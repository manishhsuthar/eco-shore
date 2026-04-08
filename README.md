# Ecoshore

Ecoshore is a beach information platform with:
- a Django + PostgreSQL backend API
- a Vite + React frontend
- live weather lookup (Open-Meteo)
- nearby beach search

## Tech Stack
- Backend: Django, Django REST Framework, PostgreSQL
- Frontend: React + Vite + Tailwind CSS
- APIs: Open-Meteo, Google Maps links

## Project Structure
- `backend/` Django project
- `frontend/` React app
- `requirements.txt` Python dependencies (at repo root)

## Prerequisites
- Python 3.10+
- Node.js 20 LTS recommended
- PostgreSQL 14+

## Backend Setup
From the project root:

```bash
python3 -m venv backend/myenv
source backend/myenv/bin/activate
pip install -r requirements.txt
```

Create backend env file:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` as needed:

```env
DJANGO_ENV=development
SECRET_KEY=change-me
DEBUG=true
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=ecoshore
DB_USER=jal
DB_PASSWORD=eco-shore123
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## PostgreSQL Setup
Create DB user and database (once):

```bash
sudo -u postgres psql
```

```sql
CREATE USER jal WITH PASSWORD 'eco-shore123';
CREATE DATABASE ecoshore OWNER jal;
\q
```

If user already exists, reset password:

```sql
ALTER USER jal WITH PASSWORD 'eco-shore123';
```

## Run Backend

```bash
cd backend
source myenv/bin/activate
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000/`.

`python manage.py migrate` now auto-seeds mock beach data so Atlas, Forecast, Nearby, and Pulse pages are not empty on first run.

## Frontend Setup and Run
In a new terminal, from project root:

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000/`.
This frontend now uses the `ecoshore-50` design and proxies `/api` calls to `http://127.0.0.1:8000`.

## Common Issues
- `password authentication failed for user "jal"`:
  - PostgreSQL credentials do not match `backend/.env`.
- `vite: not found`:
  - run `npm install` inside `frontend/`.
- `No module named 'django'`:
  - activate backend virtualenv before running `manage.py`.
- Weather API temporarily unavailable:
  - backend now returns realistic mock weather fallback so Forecast UI still shows populated values.

## API Routes
- `GET /api/beaches/`
- `GET /api/beach/<id>/`
- `GET /api/weather/?lat=<lat>&lon=<lon>`
- `GET /api/nearest-beaches/?lat=<lat>&lon=<lon>`

## Add All India Beaches To Atlas
Atlas reads from the backend `Beach` table through `GET /api/beaches/`.

To bulk add beaches:

1. Prepare a CSV using this header:

```csv
name,city,state,latitude,longitude,water_quality,crowd_density
```

Use [`backend/data/india_beaches.sample.csv`](/home/manish/Documents/project/eco-shore/backend/data/india_beaches.sample.csv) as template.

2. Run import command:

```bash
cd backend
source myenv/bin/activate
python manage.py import_india_beaches --file data/india_beaches.sample.csv
```

3. Restart backend and refresh frontend Atlas page.

Notes:
- Required columns: `name, city, state, latitude, longitude`
- Optional columns: `water_quality, crowd_density` (defaults to `Unknown`)
- Re-running import updates existing rows (same `name + city + state`) instead of duplicating.
