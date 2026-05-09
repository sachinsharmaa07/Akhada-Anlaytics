# 🏗️ Akhada Analytics — DevOps & Infrastructure Documentation

> A full-stack fitness analytics platform with a production-grade CI/CD pipeline, containerized with Docker, and auto-deployed to AWS EC2 via GitHub Actions.

---

## 📋 Project Overview

**Akhada Analytics** is a fitness tracking and analytics web application that helps users log workouts, track nutrition, and monitor personal records with visual dashboards.

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Zustand, Recharts, Framer Motion | SPA with animated dashboards and charts |
| **Backend** | Node.js, Express 5, Mongoose | REST API with JWT auth + Google OAuth |
| **Database** | MongoDB 7 | Document store for users, workouts, nutrition |
| **Reverse Proxy** | Nginx | Routes traffic, gzip, rate limiting, security headers |
| **Containerization** | Docker, Docker Compose | Multi-stage builds, 4-service production stack |
| **CI/CD** | GitHub Actions | Automated testing, building, and deployment |
| **Cloud** | AWS EC2 | Production hosting with Elastic IP |
| **Image Registry** | Docker Hub | Stores built Docker images |
| **DNS** | DuckDNS | Free domain → `akhada.duckdns.org` |

---

## 🏛️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        DEVELOPER WORKFLOW                        │
│                                                                  │
│   Local Dev ──git push──► GitHub ──trigger──► GitHub Actions     │
│                                                                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   GitHub Actions    │
                    │                     │
                    │  1. CI Gate         │
                    │     ├─ Backend test │
                    │     ├─ Client build │
                    │     └─ Docker build │
                    │                     │
                    │  2. Build & Push    │
                    │     ├─ Backend img  │──── Docker Hub
                    │     └─ Client img   │──── Docker Hub
                    │                     │
                    │  3. Deploy to EC2   │
                    │     ├─ SCP files    │
                    │     ├─ SSH deploy   │
                    │     └─ Health check │
                    └──────────┬──────────┘
                               │ SSH
                    ┌──────────▼──────────────────────────────┐
                    │         AWS EC2 (Ubuntu 24.04)          │
                    │         IP: 13.127.145.141              │
                    │         DNS: akhada.duckdns.org         │
                    │                                         │
                    │  ┌─────────────────────────────────┐    │
                    │  │  Docker Compose (4 containers)  │    │
                    │  │                                 │    │
                    │  │  :80 ► [Nginx Reverse Proxy]    │    │
                    │  │           │          │          │    │
                    │  │      /api │          │ /        │    │
                    │  │           ▼          ▼          │    │
                    │  │    [Backend:5001] [Client:3000] │    │
                    │  │     (Node.js)    (React+Nginx)  │    │
                    │  │           │                     │    │
                    │  │           ▼                     │    │
                    │  │    [MongoDB:27017]              │    │
                    │  │     (Persistent Volume)         │    │
                    │  └─────────────────────────────────┘    │
                    └─────────────────────────────────────────┘
```

---

## 🐳 Docker — Containerization Strategy

### Multi-Stage Builds

Both the backend and client use **multi-stage Docker builds** to keep production images small and secure.

#### Backend Dockerfile (`backend/Dockerfile`)

```
Stage 1 (deps)     → node:20-alpine → npm ci --omit=dev → installs only production deps
Stage 2 (runtime)  → node:20-alpine → copies deps + backend code → runs as non-root user
```

| Optimization | Benefit |
|-------------|---------|
| `node:20-alpine` base | ~5x smaller than `node:20` (~180MB vs ~900MB) |
| `--omit=dev` | Excludes devDependencies (nodemon, etc.) |
| `npm cache clean --force` | Saves ~50MB in build layer |
| `USER node` | Non-root user for security |
| `HEALTHCHECK` | Auto-restarts unhealthy containers via `/api/health` |
| Layer ordering | `package.json` copied before source → dependency layer cached |

#### Client Dockerfile (`client/Dockerfile`)

```
Stage 1 (build)    → node:20-alpine → npm ci → npm run build → generates static assets
Stage 2 (serve)    → nginx:stable-alpine → copies built assets → serves via nginx
```

| Optimization | Benefit |
|-------------|---------|
| 2-stage build | Final image is ~40MB (nginx + static files only) |
| Build args (`REACT_APP_*`) | API URL baked in at build time |
| External nginx config | Maintainable (not inline `printf`) |
| Static asset caching | `Cache-Control: public, immutable` for 1 year |
| `USER nginx` | Non-root for security |
| `HEALTHCHECK` | Verifies nginx is serving content |

### Docker Compose — Development vs Production

| Feature | `docker-compose.yml` (Dev) | `docker-compose.prod.yml` (Prod) |
|---------|---------------------------|----------------------------------|
| **Services** | 3 (mongo, backend, client) | 4 (+ nginx reverse proxy) |
| **Ports exposed** | 27017, 5001, 3000 | **Only 80** (nginx) |
| **Images** | Built locally | Pulled from Docker Hub |
| **Restart policy** | `unless-stopped` | `unless-stopped` |
| **Log rotation** | Default | JSON file, 10MB max, 3 files |
| **Health checks** | Mongo only | All 4 services |
| **Build args** | Local env | CI/CD injects secrets |

### .dockerignore Strategy

The root `.dockerignore` excludes `client/`, `.github/`, `*.md`, `docker-compose*.yml`, and IDE files — reducing the Docker build context from ~700MB to ~5MB for the backend build.

---

## 🔄 CI/CD Pipeline — GitHub Actions

### Workflow 1: CI — Test & Build (`ci.yml`)

**Triggers:** Every push to `main`, `develop`, `feature/**` branches + PRs to `main`.

```
┌─────────────────────────────────────────────────┐
│               CI — Test & Build                 │
│                                                 │
│  ┌──────────────┐    ┌───────────────────┐      │
│  │   Backend    │    │     Client        │      │
│  │              │    │                   │      │
│  │ • npm ci     │    │ • npm ci          │      │
│  │ • syntax chk │    │ • npm run build   │      │
│  │ • module     │    │ • npm test        │      │
│  │   resolution │    │   (--passWithNo   │      │
│  │              │    │    Tests)         │      │
│  └──────┬───────┘    └────────┬──────────┘      │
│         │                     │                 │
│         └──────────┬──────────┘                 │
│                    ▼                            │
│         ┌──────────────────┐                    │
│         │   Docker Build   │                    │
│         │                  │                    │
│         │ • Buildx + GHA   │                    │
│         │   layer caching  │                    │
│         │ • Build backend  │                    │
│         │ • Build client   │                    │
│         │ • Verify images  │                    │
│         └──────────────────┘                    │
└─────────────────────────────────────────────────┘
```

**Key Features:**
- **Concurrency control** — cancels in-progress CI runs on the same branch
- **Docker Buildx with GHA cache** — layers cached in GitHub Actions cache, subsequent builds reuse unchanged layers (~60% faster)
- **CI Summary** — posts a build status table in the GitHub Actions UI

### Workflow 2: CD — Deploy (`deploy.yml`)

**Triggers:** Push to `main` only (after CI passes).

```
┌──────────────────────────────────────────────────────────┐
│                CD — Deploy (AWS EC2)                     │
│                                                          │
│  ┌──────────┐    ┌────────────────┐    ┌──────────────┐  │
│  │ CI Gate  │───►│ Build & Push   │───►│ Deploy EC2   │  │
│  │          │    │                │    │              │  │
│  │ Reuses   │    │ • Docker Hub   │    │ • SCP files  │  │
│  │ ci.yml   │    │   login        │    │ • SSH in     │  │
│  │          │    │ • Build backend│    │ • Pull imgs  │  │
│  │          │    │ • Build client │    │ • Compose up │  │
│  │          │    │ • Push :latest │    │ • Health chk │  │
│  │          │    │ • Push :sha    │    │ • Cleanup    │  │
│  └──────────┘    └────────────────┘    └──────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Key Features:**
- **CI Gate** — reuses `ci.yml` as a prerequisite (no deploy if tests fail)
- **Dual tagging** — images tagged with both `latest` and the git SHA for traceability
- **SCP file sync** — automatically copies `docker-compose.prod.yml` and `nginx/default.conf` to EC2
- **Health check** — curls `/api/health` after deploy, fails the pipeline if unhealthy
- **Failure logging** — if health check fails, prints container status + backend logs
- **Image pruning** — cleans up old Docker images on EC2 to save disk

### GitHub Secrets (8 total)

| Secret | Purpose |
|--------|---------|
| `DOCKERHUB_USERNAME` | Docker Hub login |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `EC2_HOST` | EC2 Elastic IP address |
| `EC2_USER` | SSH username (`ubuntu`) |
| `EC2_SSH_KEY` | SSH private key (`.pem` contents) |
| `EC2_APP_DIR` | App directory on EC2 (`/opt/akhada-analytics`) |
| `REACT_APP_API_URL` | Production API URL baked into React build |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth client ID for frontend |

---

## ☁️ AWS EC2 — Production Infrastructure

### Instance Details

| Property | Value |
|----------|-------|
| **AMI** | Ubuntu Server 24.04 LTS |
| **Instance Type** | t3.small (2 vCPU, 2 GB RAM) |
| **Storage** | 20 GB gp3 EBS |
| **Elastic IP** | `13.127.145.141` |
| **Region** | `ap-south-1` (Mumbai) |
| **DNS** | `akhada.duckdns.org` → `13.127.145.141` |

### Security Group Rules

| Rule | Port | Source | Purpose |
|------|------|--------|---------|
| SSH | 22 | 0.0.0.0/0 | Remote management |
| HTTP | 80 | 0.0.0.0/0 | Web traffic via nginx |
| HTTPS | 443 | 0.0.0.0/0 | Future SSL traffic |

> Ports 5001 (backend), 3000 (client), 27017 (MongoDB) are **NOT exposed** — only accessible internally via Docker network.

### Installed Software

| Software | Version | Purpose |
|----------|---------|---------|
| Docker | 29.4.3 | Container runtime |
| Docker Compose | v5.1.3 | Multi-container orchestration |

### Directory Structure on EC2

```
/opt/akhada-analytics/
├── .env                      # Production environment variables
├── docker-compose.prod.yml   # Production compose (synced by CI/CD)
└── nginx/
    └── default.conf          # Reverse proxy config (synced by CI/CD)
```

---

## 🌐 Nginx — Reverse Proxy Configuration

### Production Proxy (`nginx/default.conf`)

The entry-point nginx container sits on port 80 and routes all traffic:

| Route | Destination | Features |
|-------|-------------|----------|
| `/api/*` | `backend:5001` | Rate limiting (30 req/s, burst 50), keepalive connections |
| `/*` | `client:3000` | Proxy to client's internal nginx |
| `/nginx-health` | Self | Returns 200 OK for monitoring |

**Security Headers Applied:**
- `X-Frame-Options: SAMEORIGIN` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` — XSS filter
- `Referrer-Policy: strict-origin-when-cross-origin`

**Performance:**
- Gzip compression for text, JSON, CSS, JS, SVG (level 6)
- Upstream keepalive connections (32 for backend, 16 for client)
- Client body size limit: 10MB

### Client Nginx (`client/nginx/default.conf`)

The nginx inside the client container:

| Feature | Configuration |
|---------|--------------|
| SPA Routing | `try_files $uri $uri/ /index.html` |
| API Proxy | `/api` → `backend:5001` (with WebSocket upgrade headers) |
| Static Caching | JS/CSS/images cached for 1 year with `immutable` |
| Gzip | Enabled for all text-based content |

---

## 🔐 Environment & Security

### Environment Variable Strategy

| Environment | `.env` Location | Managed By |
|-------------|----------------|------------|
| **Local Dev** | Project root `.env` | Developer (git-ignored) |
| **CI/CD** | GitHub Actions Secrets | GitHub UI |
| **Production EC2** | `/opt/akhada-analytics/.env` | Manual on server |

### Security Measures

| Layer | Measure |
|-------|---------|
| **Git** | `.gitignore` excludes `.env`, `.pem` files, `node_modules` |
| **GitHub** | Push protection blocks accidentally committed secrets |
| **Docker** | Non-root users (`node`, `nginx`) in all containers |
| **Nginx** | Security headers, rate limiting, body size limits |
| **Backend** | Helmet.js, CORS whitelist, rate-limited auth routes |
| **Auth** | JWT with access + refresh tokens, bcrypt password hashing |
| **EC2** | Only port 22/80/443 exposed, internal Docker network for services |

---

## 📊 API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | User registration |
| `POST` | `/api/auth/login` | ❌ | Email/password login |
| `POST` | `/api/auth/google` | ❌ | Google OAuth sign-in |
| `POST` | `/api/auth/refresh` | 🔄 | Refresh JWT token |
| `POST` | `/api/auth/logout` | ✅ | Logout (invalidate refresh token) |
| `GET` | `/api/user/profile` | ✅ | Get user profile |
| `PUT` | `/api/user/profile` | ✅ | Update user profile |
| `GET` | `/api/workout` | ✅ | List user workouts |
| `POST` | `/api/workout` | ✅ | Log a workout |
| `PUT` | `/api/workout/:id` | ✅ | Update a workout |
| `DELETE` | `/api/workout/:id` | ✅ | Delete a workout |
| `GET` | `/api/nutrition` | ✅ | List nutrition logs |
| `POST` | `/api/nutrition` | ✅ | Log nutrition entry |
| `GET` | `/api/food/search` | ✅ | Search food database |
| `GET` | `/api/health` | ❌ | Health check (used by Docker + CI/CD) |

---

## 📁 Project Structure

```
akhada-analytics/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI: test, build, Docker validate
│       └── deploy.yml             # CD: Docker Hub push → EC2 deploy
│
├── backend/
│   ├── Dockerfile                 # Multi-stage Node.js image
│   ├── server.js                  # Express entry point
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Workout.js             # Workout schema
│   │   ├── NutritionLog.js        # Nutrition schema
│   │   ├── Exercise.js            # Exercise catalog
│   │   ├── PersonalRecord.js      # PR tracking
│   │   └── RefreshToken.js        # Token rotation
│   ├── routes/
│   │   ├── auth.js                # Auth endpoints
│   │   ├── user.js                # User profile
│   │   ├── workout.js             # Workout CRUD
│   │   ├── nutrition.js           # Nutrition CRUD
│   │   └── food.js                # Food search API
│   └── seed.js                    # Database seeder
│
├── client/
│   ├── Dockerfile                 # Multi-stage React → Nginx image
│   ├── nginx/
│   │   └── default.conf           # Client nginx config
│   ├── src/
│   │   ├── App.jsx                # Router + layout
│   │   ├── api/                   # Axios API client
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Route pages
│   │   ├── stores/                # Zustand state management
│   │   └── styles/                # CSS modules
│   └── public/                    # Static assets
│
├── nginx/
│   └── default.conf               # Production reverse proxy
│
├── docker-compose.yml             # Development (local)
├── docker-compose.prod.yml        # Production (EC2)
├── .dockerignore                  # Docker build exclusions
├── .env.example                   # Dev env template
├── .env.ec2.example               # Production env template
├── DEPLOYMENT.md                  # Step-by-step deploy guide
├── DEVOPS.md                      # This file
└── package.json                   # Root (backend dependencies)
```

---

## 🔁 Deployment Flow — End to End

```
1. Developer pushes to main
         │
2. GitHub Actions triggers CD workflow
         │
3. CI Gate runs (reuses ci.yml)
   ├── Backend: npm ci → syntax check → module resolution
   ├── Client:  npm ci → npm run build → npm test
   └── Docker:  Buildx build both images (with GHA layer cache)
         │
4. Build & Push to Docker Hub
   ├── sachinsharmaa07/akhada-backend:latest + :sha
   └── sachinsharmaa07/akhada-client:latest  + :sha
         │
5. Deploy to EC2 via SSH
   ├── SCP: docker-compose.prod.yml + nginx/default.conf → EC2
   ├── SSH: docker compose pull → up -d --remove-orphans
   ├── Wait 15s for startup
   ├── Health check: curl http://localhost/api/health
   └── Cleanup: docker image prune -f
         │
6. App live at http://akhada.duckdns.org ✅
```

**Typical deploy time:** ~5-8 min (first run), ~4 min (cached subsequent runs).

---

## 🛠️ Local Development

```bash
# Clone the repo
git clone https://github.com/sachinsharmaa07/Akhada-Anlaytics.git
cd Akhada-Anlaytics

# Install dependencies
npm install          # backend
cd client && npm install && cd ..

# Start with Docker Compose (recommended)
docker compose up -d

# OR start manually
# Terminal 1: Start MongoDB (must be running)
# Terminal 2: npm run dev        (backend on :5001)
# Terminal 3: cd client && npm start  (frontend on :3000)
```

---

## 📝 Key DevOps Decisions

| Decision | Why |
|----------|-----|
| **Docker Hub over ECR** | Simpler setup, no AWS CLI needed on EC2, free tier sufficient |
| **Docker Compose over ECS/K8s** | Single EC2 instance, overkill to use orchestrators for this scale |
| **Nginx reverse proxy** | Single entry point on port 80, security headers, rate limiting |
| **GHA layer caching** | `cache-from: type=gha` speeds up builds by ~60% |
| **Health checks everywhere** | Docker auto-restarts unhealthy containers, CI/CD validates deploys |
| **Non-root containers** | Security best practice — limits blast radius if container is compromised |
| **DuckDNS** | Free domain for Google OAuth (which rejects bare IP addresses) |
| **Dual image tags** | `:latest` for easy deploys, `:sha` for rollback traceability |
| **SCP in deploy** | Compose + nginx config always synced from repo — no config drift |
