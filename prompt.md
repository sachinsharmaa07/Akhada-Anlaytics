# Akhada Analytics — Complete Project Documentation

> *"Akhada"* (अखाड़ा) — a traditional Indian wrestling arena. Train like a warrior, track like a scientist.

**Akhada Analytics** is a full-stack, mobile-first fitness intelligence platform that combines workout logging, nutrition tracking, body analytics, and personal record detection into one application. It is built with a **React 19** frontend, **Node.js/Express 5** backend, **MongoDB** database, fully **Dockerized**, and deployed via **Vercel** (client), **Render** (API), and optionally **AWS EC2** — all automated through **GitHub Actions CI/CD**.

**Live:** [https://akhada-anlaytics.vercel.app](https://akhada-anlaytics.vercel.app)  
**Repo:** [github.com/sachinsharmaa07/Akhada-Anlaytics](https://github.com/sachinsharmaa07/Akhada-Anlaytics)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Frontend (React)](#2-frontend-react)
3. [Backend (Node.js / Express)](#3-backend-nodejs--express)
4. [Database (MongoDB)](#4-database-mongodb)
5. [Authentication System](#5-authentication-system)
6. [API Reference](#6-api-reference)
7. [Docker Setup](#7-docker-setup)
8. [CI/CD — GitHub Actions](#8-cicd--github-actions)
9. [Deployment — Vercel & Render](#9-deployment--vercel--render)
10. [Environment Variables](#10-environment-variables)
11. [Project Structure](#11-project-structure)

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                      USERS (Browser)                     │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS
          ┌──────────────┴──────────────┐
          │                             │
  ┌───────▼────────┐          ┌────────▼─────────┐
  │  Vercel (CDN)  │          │  Render / AWS EC2 │
  │  React 19 SPA  │  ─────► │  Express 5 API    │
  │  Static Files  │  /api/* │  Port 5001        │
  └────────────────┘          └────────┬──────────┘
                                       │
                              ┌────────▼──────────┐
                              │  MongoDB Atlas /   │
                              │  Docker MongoDB 7  │
                              │  Port 27017        │
                              └───────────────────┘
```

| Layer | Technology | Hosting |
|-------|-----------|---------|
| Frontend | React 19, React Router 7, Zustand 5, Recharts 3, Framer Motion | Vercel |
| Backend | Node.js, Express 5, JWT, bcrypt, Helmet, Rate Limiting | Render / AWS EC2 |
| Database | MongoDB 7, Mongoose 9 | MongoDB Atlas / Docker |
| DevOps | Docker Compose, GitHub Actions, Nginx (prod) | GitHub / AWS |

---

## 2. Frontend (React)

### Tech Stack
- **React 19** with functional components and hooks
- **React Router 7** — SPA routing with protected routes
- **Zustand 5** — lightweight global state management
- **Recharts 3** — analytics charts (calorie trends, macro breakdown, volume progression)
- **Framer Motion** — page transitions and micro-animations
- **Lucide React** — icon library
- **Axios** — HTTP client with interceptors for token refresh
- **Create React App** — build tooling

### Pages (10 total)

| Page | File | Description |
|------|------|-------------|
| Login | `Login.jsx` | Email/password + Google OAuth sign-in |
| Register | `Register.jsx` | New account creation with profile fields |
| Onboarding | `Onboarding.jsx` | Post-signup profile completion (username, body stats, goals) |
| Home | `Home.jsx` | Dashboard with daily summary, stats, quick actions |
| Workout | `Workout.jsx` | Workout history, PR display, muscle heatmap |
| Workout Log | `WorkoutLog.jsx` | Live workout logging with exercise search, sets/reps/weight, timer |
| Nutrition | `Nutrition.jsx` | Meal-based food logging, macro rings, multi-cuisine food search |
| Analytics | `Analytics.jsx` | BMI/TDEE/BMR calculator, calorie trends, macro charts, volume progression |
| Profile | `Profile.jsx` | Edit profile, update daily goals, view stats |
| Reset Password | `ResetPassword.jsx` | Password reset flow |

### Key Components

| Component | Description |
|-----------|-------------|
| `MuscleHeatMap.jsx` | SVG-based interactive body visualizer showing 7-day muscle frequency with color-coded intensity |
| `BodyVisualizer.jsx` | Interactive front/back body model with muscle activation highlighting |
| `MacroRing.jsx` | Circular progress rings for protein, carbs, fats goal tracking |
| `Navbar.jsx` | Bottom navigation bar (mobile-first) with route-aware active states |
| `ProtectedRoute.jsx` | Auth guard — redirects unauthenticated users, enforces onboarding |
| `Toast.jsx` | Toast notification system |
| `Skeleton.jsx` | Loading skeleton placeholders |

### State Management (Zustand Stores)

| Store | State |
|-------|-------|
| `authStore.js` | `user`, `token`, `loading`, `setUser()`, `logout()`, `isOnboarded()`, `isAuthenticated()` |
| `workoutStore.js` | Current workout session state, exercises, timer |
| `nutritionStore.js` | Today's nutrition log cache |
| `toastStore.js` | Toast queue with auto-dismiss |

### API Client (`api.js`)

- Base URL from `REACT_APP_API_URL` env var (defaults to `http://localhost:5001/api`)
- `withCredentials: true` — sends httpOnly cookies cross-origin
- **Request interceptor**: attaches `Bearer` token from `localStorage`
- **Response interceptor**: on 401, attempts silent token refresh via `/auth/refresh`; on failure, clears token and redirects to `/login`; on 403 with `ONBOARDING_REQUIRED`, redirects to `/onboarding`
- Token refresh uses a **queue pattern** — concurrent 401s are batched into a single refresh call

### Built-in Food Databases (client-side)

| File | Items | Cuisine |
|------|-------|---------|
| `indianFoodDb.js` | 500+ | Indian (dal, paneer, biryani, dosa, etc.) |
| `usFoodDb.js` | 200+ | American (burgers, steaks, salads, etc.) |
| `europeanFoodDb.js` | 200+ | European (French, Italian, German, Spanish) |
| `supplementsFoodDb.js` | 20+ | Supplements (whey, creatine, protein bars) |
| `exerciseDb.js` | 150+ | Exercise catalog with muscle groups |
| `legendTemplates.js` | 4 athletes | Chris Bumstead, Ronnie Coleman, Larry Wheels, Jeff Nippard programs |
| `workoutTemplates.js` | 6 templates | Push, Pull, Legs, Upper, Lower, Full Body |

### Vercel Config (`client/vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
The `rewrites` rule enables SPA client-side routing — all paths serve `index.html`.

---

## 3. Backend (Node.js / Express)

### Tech Stack
- **Express 5** — web framework
- **Mongoose 9** — MongoDB ODM
- **JWT** — dual-token auth (access + refresh)
- **bcryptjs** — password hashing (12 salt rounds)
- **Helmet** — secure HTTP headers
- **express-rate-limit** — brute-force protection (15 req/15 min on auth routes)
- **compression** — gzip response compression
- **cookie-parser** — httpOnly cookie handling
- **express-validator** — input validation
- **axios** — USDA API calls
- **dotenv** — environment variable loading

### Server Entry (`backend/server.js`)

Key behaviors:
- Only loads `.env` file if it exists (skips in production — Render injects env vars)
- CORS configured with comma-separated `CLIENT_URL` origins
- MongoDB connection with 10-connection pool, 5s selection timeout, 45s socket timeout
- Rate limiter on `/api/auth` routes: 15 requests per 15 minutes per IP
- Global error handler returns generic 500 responses
- Health check endpoint at `GET /api/health`

### Middleware

**`authMiddleware.js`** provides:
1. **`protect`** — extracts JWT from `Authorization: Bearer` header OR `access_token` cookie, verifies with `JWT_SECRET`, attaches decoded payload to `req.user`
2. **`requireOnboarded`** — blocks access for users with `onboardingStatus: 'INCOMPLETE'`, returns 403 with `ONBOARDING_REQUIRED` code

### Route Modules (5 total)

| Route File | Mount Point | Auth | Description |
|-----------|-------------|------|-------------|
| `auth.js` | `/api/auth` | Rate limited | Register, login, Google OAuth, onboarding, token refresh, logout, username check |
| `user.js` | `/api/user` | Protected | Profile CRUD, goal updates, user stats |
| `workout.js` | `/api/workout` | Protected | Workout CRUD, exercise search, PR detection, muscle heatmap, last-used weights, metrics recompute |
| `nutrition.js` | `/api/nutrition` | Protected | Daily food logging, meal management, nutrition history, vitamin/mineral totals |
| `food.js` | `/api/food` | Public | Multi-cuisine food search (USDA API + Indian + Mexican + Supplements) |

---

## 4. Database (MongoDB)

### Collections & Schemas (6 models)

#### `User`
| Field | Type | Details |
|-------|------|---------|
| `name` | String | Required |
| `email` | String | Required, unique, lowercase |
| `password` | String | Nullable (OAuth users have no password) |
| `username` | String | Unique, sparse, lowercase |
| `authProvider` | Enum | `'local'` or `'google'` |
| `googleId` | String | Unique, sparse |
| `avatar` | String | Google profile picture URL |
| `onboardingStatus` | Enum | `'INCOMPLETE'` or `'COMPLETE'` |
| `gender` | Enum | `'male'`, `'female'`, `'other'` |
| `age`, `weight`, `height` | Number | Body metrics |
| `activityLevel` | Enum | `'sedentary'` through `'veryActive'` |
| `dailyGoal` | Object | `{ calories: 2200, protein: 160, carbs: 250, fats: 70 }` |
| `isDeleted` | Boolean | Soft delete flag |
| **Indexes** | | `{ googleId: 1 }`, `{ email: 1, authProvider: 1 }` |

#### `Workout`
| Field | Type | Details |
|-------|------|---------|
| `user` | ObjectId → User | Required |
| `date` | Date | Workout date |
| `logDate` | Date | Analytics/streaks date (synced via pre-save hook) |
| `exercises[]` | Array | Each with `exerciseId`, `exerciseName`, `muscleGroup`, `secondaryMuscles`, `sets[]`, `notes`, `metrics` |
| `exercises[].sets[]` | Array | `{ setNumber, reps, weight, unit, completed }` |
| `exercises[].metrics` | Object | `{ totalReps, totalVolume, completedSets }` — computed at write time |
| `totalVolume` | Number | Sum of all (weight × reps) across completed sets |
| `totalReps` | Number | Sum of all reps across completed sets |
| `derived` | Object | `{ caloriesBurned, weeklyOverloadPct, muscleFrequency }` |
| `duration` | Number | Workout duration in minutes |
| **Indexes** | | `{ user: 1, date: 1 }`, `{ user: 1, logDate: 1 }` |

#### `NutritionLog`
| Field | Type | Details |
|-------|------|---------|
| `user` | ObjectId → User | Required |
| `date` | Date | Required — one log per user per day |
| `meals[]` | Array | Each: `{ mealType: 'breakfast'|'lunch'|'dinner'|'snack', items[] }` |
| `meals[].items[]` | Array | `{ foodName, foodId, quantity, unit, quantityGrams, calories, protein, carbs, fats, fiber, vitamins{}, minerals{} }` |
| `meals[].items[].vitamins` | Object | `{ vitA, vitC, vitD, vitE, vitK, vitB12 }` |
| `meals[].items[].minerals` | Object | `{ calcium, iron, magnesium, potassium, zinc }` |
| **Indexes** | | `{ user: 1, date: 1 }`, `{ user: 1, logDate: 1 }` |

#### `Exercise`
| Field | Type | Details |
|-------|------|---------|
| `name` | String | Required |
| `muscleGroup` | Enum | 12 groups: chest, back, shoulders, biceps, triceps, forearms, abs, obliques, quads, hamstrings, glutes, calves |
| `secondaryMuscles` | [Enum] | Same enum as muscleGroup |
| `equipment` | Enum | barbell, dumbbell, machine, bodyweight, cable |
| `category` | Enum | strength, cardio, flexibility |

#### `PersonalRecord`
| Field | Type | Details |
|-------|------|---------|
| `user` | ObjectId → User | Required |
| `exerciseId` | ObjectId → Exercise | Required |
| `recordType` | Enum | `'1RM'`, `'maxReps'`, `'maxVolume'` |
| `value` | Number | Current PR value |
| `previousValue` | Number | Previous PR (for delta display) |
| `date` | Date | When the PR was set |

#### `RefreshToken`
| Field | Type | Details |
|-------|------|---------|
| `userId` | ObjectId → User | Required |
| `token` | String | 64-byte random hex, unique |
| `authProvider` | Enum | `'local'` or `'google'` |
| `expiresAt` | Date | 30 days from creation |
| `revokedAt` | Date | Set on logout or rotation |
| `replacedByToken` | String | Token rotation audit trail |
| **TTL Index** | | `{ expiresAt: 1 }` — auto-deletes expired tokens |
| **Methods** | | `isExpired()`, `isRevoked()`, `isActive()` |

---

## 5. Authentication System

### Dual-Token Architecture

```
┌─────────────┐         ┌──────────────┐        ┌───────────────┐
│   Client    │ ──────► │  Access JWT  │ ─────► │   Backend     │
│  (Browser)  │         │  (15 min)    │        │   Verifies    │
│             │         │  httpOnly    │        │   req.user    │
│             │         │  cookie      │        │               │
│             │         └──────────────┘        └───────────────┘
│             │
│             │         ┌──────────────┐        ┌───────────────┐
│             │ ──────► │ Refresh Token│ ─────► │   Rotates &   │
│             │  401    │  (30 days)   │        │   Issues New  │
│             │  retry  │  httpOnly    │        │   Token Pair  │
│             │         │  cookie      │        │               │
└─────────────┘         └──────────────┘        └───────────────┘
```

**Flow:**
1. On login/register/Google OAuth → server creates access JWT (15 min) + refresh token (30 days)
2. Both set as httpOnly cookies (`secure: true` in production, `sameSite: 'none'`)
3. A legacy `Bearer` token (7 days) is also returned in JSON for backwards compatibility
4. On 401 → client interceptor calls `POST /auth/refresh` → old token revoked, new pair issued (rotation)
5. On refresh token reuse → **entire token family revoked** (security: detects stolen tokens)
6. On logout → refresh token revoked, cookies cleared

**Google OAuth:** Frontend sends Google ID token → backend verifies via `https://oauth2.googleapis.com/tokeninfo` → checks audience matches configured client IDs → creates/links user account

---

## 6. API Reference

### Auth — `/api/auth` (Rate Limited: 15 req / 15 min)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/register` | `{ name, email, password, gender?, age?, weight?, height?, activityLevel? }` | Create local account |
| POST | `/login` | `{ email, password }` | Email/password login |
| POST | `/google` | `{ credential }` | Google OAuth (ID token) |
| POST | `/onboarding` | `{ username, gender, age, weight, height, activityLevel, dailyGoal }` | Complete profile (Protected) |
| POST | `/refresh` | Cookie-based | Rotate token pair |
| POST | `/logout` | — | Revoke session, clear cookies |
| GET | `/check-username/:username` | — | Username availability check |

### User — `/api/user` (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get user profile (minus password) |
| PUT | `/profile` | Update name, gender, age, weight, height, activityLevel |
| PUT | `/goals` | Update daily macro goals |
| GET | `/stats` | Total workouts, nutrition logs, last workout date |

### Workouts — `/api/workout` (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Paginated workout list (`?page=1&limit=10`) |
| POST | `/` | Log workout with auto PR detection |
| GET | `/:id` | Single workout detail |
| DELETE | `/:id` | Delete workout |
| GET | `/exercises/search` | Search exercise DB (`?q=bench`) |
| GET | `/last-weights` | Last-used weights for exercise (`?exerciseName=Bench Press`) |
| GET | `/muscles/last7days` | 7-day muscle frequency heatmap data |
| GET | `/pr` | All personal records |
| POST | `/metrics/recompute` | Recompute derived metrics for all workouts |

### Nutrition — `/api/nutrition` (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/today` | Today's log with summary and goal progress % |
| POST | `/log` | Add food items to a meal (`{ mealType, items[] }`) |
| DELETE | `/log/:mealType/:itemIndex` | Remove specific food item |
| GET | `/history` | Multi-day history (`?days=7`) |
| GET | `/vitamins/today` | Today's vitamin & mineral totals |

### Food Search — `/api/food` (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search` | USDA FoodData Central API (`?q=chicken`) |
| GET | `/search/indian` | 30 built-in Indian foods |
| GET | `/search/mexican` | 30 built-in Mexican foods |
| GET | `/search/supplements` | 20 built-in supplements & common foods |

---

## 7. Docker Setup

### Local Development — `docker-compose.yml`

Three containers on a shared `akhada-net` bridge network:

| Container | Image | Port | Details |
|-----------|-------|------|---------|
| `akhada-mongo` | `mongo:7` | 27017 | Persistent volume `mongo_data`, health check via `mongosh ping` |
| `akhada-backend` | Custom (Node 20 Alpine) | 5001 | Builds from `backend/Dockerfile`, reads `.env`, overrides `MONGO_URI` to use Docker DNS |
| `akhada-client` | Custom (multi-stage: Node 20 build → nginx) | 3000 | Builds from `client/Dockerfile`, React build with env args, served via nginx with SPA routing + API proxy |

**Usage:**
```bash
docker compose up --build        # start all
docker compose down              # stop
docker compose down -v           # stop + wipe DB
```

### Production — `docker-compose.prod.yml`

Adds nginx reverse proxy + certbot for SSL:

| Container | Purpose |
|-----------|---------|
| `akhada-mongo` | Same as dev, but **no exposed ports** (internal only) |
| `akhada-backend` | `expose: 5001` (internal only) |
| `akhada-client` | `expose: 3000` (internal only) |
| `akhada-nginx` | Ports 80 + 443, SSL termination, API proxy, security headers |
| `akhada-certbot` | Let's Encrypt auto-renewal every 12 hours |

### Dockerfiles

**Backend** (`backend/Dockerfile`): Node 20 Alpine → `npm ci --omit=dev` → copy `backend/` → `CMD node backend/server.js`

**Client** (`client/Dockerfile`): Multi-stage — Stage 1: Node 20 build with `REACT_APP_*` args → `npm run build` — Stage 2: `nginx:stable-alpine` serves built files with SPA routing + API reverse proxy to `backend:5001`

---

## 8. CI/CD — GitHub Actions

### Workflow 1: CI — Test & Build (`ci.yml`)

**Triggers:** Every push to `main`, `develop`, `feature/**` and every PR to `main`

| Job | Steps |
|-----|-------|
| 🔧 **Backend** | Checkout → Node 20 → `npm ci` → `node --check server.js` → verify all route modules resolve |
| ⚛️ **Client** | Checkout → Node 20 → `npm ci` → production build → `npm test --watchAll=false --passWithNoTests` |
| 🐳 **Docker** | (needs backend + client) → Checkout → create dummy `.env` → `docker compose build` → verify images |

Uses `concurrency` with `cancel-in-progress: true` to abort stale CI runs.

### Workflow 2: CD — Deploy to Render & Vercel (`deploy.yml`)

**Triggers:** Push to `main` only (after CI gate passes)

| Job | Mechanism | Secrets Needed |
|-----|-----------|----------------|
| 🚀 **Backend → Render** | `curl -X POST $RENDER_DEPLOY_HOOK_URL` | `RENDER_DEPLOY_HOOK_URL` |
| 🌐 **Client → Vercel** | `vercel pull` → `vercel build --prod` → `vercel deploy --prebuilt --prod` | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` |

Both jobs **gracefully skip** with helpful setup instructions if secrets are not configured.

### Required GitHub Secrets

| Secret | Source |
|--------|--------|
| `RENDER_DEPLOY_HOOK_URL` | Render Dashboard → Service → Settings → Deploy Hook |
| `VERCEL_TOKEN` | vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Run `vercel link` in `client/`, check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Same as above |

---

## 9. Deployment — Vercel & Render

### Frontend → Vercel

- **Root directory:** `client`
- **Framework:** Create React App
- **Build:** `npm run build` → output in `build/`
- **Routing:** SPA rewrites via `vercel.json` (`/(.*) → /index.html`)
- **Env vars (Vercel dashboard):** `REACT_APP_API_URL` = `https://your-render-api.onrender.com/api`, `REACT_APP_GOOGLE_CLIENT_ID`

### Backend → Render

- **Config:** `render.yaml` (Blueprint auto-detected)
- **Runtime:** Node.js
- **Build:** `npm install`
- **Start:** `node backend/server.js`
- **Env vars (set manually):** `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL` (Vercel URL), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_IDS`, `GOOGLE_CLIENT_SECRET`
- **Plan:** Free tier

### Database → MongoDB Atlas

- Free M0 cluster
- Connection string set as `MONGO_URI` on Render
- Mongoose connection pool: 10 connections
- Indexes: compound indexes on `{ user, date }` for fast per-user queries

---

## 10. Environment Variables

### Backend (`.env` / `.env.prod`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | ✅ | — | MongoDB connection string |
| `PORT` | ❌ | `5001` | Server port |
| `NODE_ENV` | ❌ | `development` | `development` or `production` |
| `JWT_SECRET` | ✅ | — | Access token signing secret |
| `JWT_REFRESH_SECRET` | ✅ | — | Refresh token signing secret |
| `CLIENT_URL` | ✅ | `http://localhost:3000` | Allowed CORS origins (comma-separated) |
| `GOOGLE_CLIENT_ID` | ❌ | — | Google OAuth client ID |
| `GOOGLE_CLIENT_IDS` | ❌ | — | Comma-separated list of allowed Google client IDs |
| `GOOGLE_CLIENT_SECRET` | ❌ | — | Google OAuth client secret |
| `USDA_API_KEY` | ❌ | `DEMO_KEY` | USDA FoodData Central API key |
| `NUTRITIONIX_APP_ID` | ❌ | — | Nutritionix API app ID |
| `NUTRITIONIX_APP_KEY` | ❌ | — | Nutritionix API key |

### Frontend (client `.env`)

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend API base URL (e.g., `https://api.render.com/api`) |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth client ID for frontend |

---

## 11. Project Structure

```
Akhada Analytics/
├── .github/workflows/
│   ├── ci.yml                    # CI — lint, build, test, Docker build
│   └── deploy.yml                # CD — deploy to Render & Vercel
├── backend/
│   ├── Dockerfile                # Node 20 Alpine production image
│   ├── server.js                 # Express entry (CORS, Helmet, MongoDB, routes)
│   ├── seed.js                   # Exercise database seeder (150+ exercises)
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verify (Bearer + cookie), onboarding guard
│   ├── models/
│   │   ├── User.js               # User profile, goals, auth provider
│   │   ├── Workout.js            # Workouts with exercises, sets, derived metrics
│   │   ├── NutritionLog.js       # Daily nutrition with meals, items, vitamins
│   │   ├── Exercise.js           # Exercise catalog (12 muscle groups, 5 equipment)
│   │   ├── PersonalRecord.js     # PR tracking (1RM, maxReps, maxVolume)
│   │   └── RefreshToken.js       # Token rotation with TTL auto-cleanup
│   └── routes/
│       ├── auth.js               # Register, login, Google OAuth, refresh, logout
│       ├── user.js               # Profile CRUD, goals, stats
│       ├── workout.js            # Workout CRUD, PR detection, muscle heatmap
│       ├── nutrition.js          # Food logging, history, vitamin totals
│       └── food.js               # Multi-cuisine search (USDA + Indian + Mexican)
├── client/
│   ├── Dockerfile                # Multi-stage: React build → nginx serve
│   ├── .dockerignore
│   ├── vercel.json               # SPA rewrites for Vercel
│   ├── package.json              # React 19, Zustand, Recharts, Framer Motion
│   └── src/
│       ├── App.jsx               # Router: public (login/register) + protected routes
│       ├── api/api.js            # Axios with token refresh interceptor
│       ├── pages/                # 10 pages (Login → Analytics)
│       ├── components/           # MuscleHeatMap, BodyVisualizer, MacroRing, Navbar, etc.
│       ├── stores/               # Zustand: auth, workout, nutrition, toast
│       ├── data/                 # 500+ Indian, 200+ US, 200+ EU foods, exercises, templates
│       └── styles/               # CSS modules per page
├── nginx/default.conf            # Prod reverse proxy (SSL, security headers, gzip)
├── docker-compose.yml            # Local dev (Mongo + Backend + Client)
├── docker-compose.prod.yml       # Production (+ nginx SSL + certbot)
├── render.yaml                   # Render deployment blueprint
├── .env.example                  # Environment variable template
├── .dockerignore
├── .gitignore
└── package.json                  # Root: Express backend deps + start/dev scripts
```

---

*Built with 💪 by [Sachin Sharma](https://github.com/sachinsharmaa07)*
