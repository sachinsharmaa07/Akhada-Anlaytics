<p align="center">
  <img src="client/src/images/logo.png" alt="Akhada Analytics" width="80" />
</p>

<h1 align="center">Akhada Analytics</h1>

<p align="center">
  <strong>Your Personal Fitness Intelligence Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

<p align="center">
  <a href="https://github.com/sachinsharmaa07/Akhada-Anlaytics/actions/workflows/ci.yml">
    <img src="https://github.com/sachinsharmaa07/Akhada-Anlaytics/actions/workflows/ci.yml/badge.svg" alt="CI — Test & Build" />
  </a>
  <a href="https://github.com/sachinsharmaa07/Akhada-Anlaytics/actions/workflows/deploy.yml">
    <img src="https://github.com/sachinsharmaa07/Akhada-Anlaytics/actions/workflows/deploy.yml/badge.svg" alt="CD — Deploy" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/languages/top/sachinsharmaa07/Akhada-Anlaytics?style=flat-square&color=F7DF1E" />
  <img src="https://img.shields.io/github/repo-size/sachinsharmaa07/Akhada-Anlaytics?style=flat-square&color=00d4aa" />
  <img src="https://img.shields.io/github/last-commit/sachinsharmaa07/Akhada-Anlaytics?style=flat-square&color=ff6b6b" />
  <img src="https://img.shields.io/badge/license-ISC-blue?style=flat-square" />
</p>

---

## ⚡ What is Akhada Analytics?

Akhada Analytics is a **full-stack fitness tracking platform** that combines workout logging, nutrition tracking, and body analytics into one sleek, mobile-first application. Built for athletes who want data-driven insights into their training.

> *"Akhada"* (अखाड़ा) — a traditional Indian wrestling arena. Train like a warrior, track like a scientist.

---

## 🎯 Key Features

## 🌐 Deployment (AWS EC2 + Docker Compose)

### Overview
- Build images in CI and push to Amazon ECR.
- EC2 pulls the latest images and restarts services with Docker Compose.

### One-time EC2 setup
1. Install Docker, Docker Compose, and AWS CLI on the instance.
2. Attach an IAM role with Amazon ECR read access.
3. Clone this repo to a directory (for example, `/opt/akhada-analytics`).
4. Create a `.env` file in that directory.

Example `.env` (on EC2):

```env
BACKEND_IMAGE=123456789012.dkr.ecr.us-east-1.amazonaws.com/akhada-backend:latest
CLIENT_IMAGE=123456789012.dkr.ecr.us-east-1.amazonaws.com/akhada-client:latest

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/akhada_analytics
PORT=5001
NODE_ENV=production
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLIENT_URL=https://your-domain
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Deploy on EC2

```bash
docker compose pull
## 🌐 Deployment (AWS EC2 + Docker Compose)

### Overview
- Build images in CI and push to Amazon ECR.
- EC2 pulls the latest images and restarts services with Docker Compose.

### One-time EC2 setup
1. Install Docker, Docker Compose, and AWS CLI on the instance.
2. Attach an IAM role with Amazon ECR read access.
3. Clone this repo to a directory (for example, `/opt/akhada-analytics`).
4. Create a `.env` file in that directory.

Example `.env` (on EC2):

```env
BACKEND_IMAGE=123456789012.dkr.ecr.us-east-1.amazonaws.com/akhada-backend:latest
CLIENT_IMAGE=123456789012.dkr.ecr.us-east-1.amazonaws.com/akhada-client:latest

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/akhada_analytics
PORT=5001
NODE_ENV=production
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLIENT_URL=https://your-domain
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Deploy on EC2

```bash
docker compose pull
docker compose up -d
```

Expose port 3000 (and 5001 only if you need direct API access). For a custom domain, put a reverse proxy in front of the client container and set `CLIENT_URL` to the public URL.

---

## ⚙️ CI/CD — GitHub Actions

Two workflows automate testing and deployment on every push:

### CI — Test & Build (`.github/workflows/ci.yml`)

Runs on every **push** and **pull request**:

| Job | What it does |
|-----|--------------|
| 🔧 **Backend** | Install deps, syntax-check `server.js`, verify all route modules resolve |
| ⚛️ **Client** | Install deps, production build, run React tests |
| 🐳 **Docker** | Validate `docker compose build` succeeds |

### CD — Deploy (`.github/workflows/deploy.yml`)

Runs on push to `main` **after CI passes**:

| Job | Target | Mechanism |
|-----|--------|-----------|
| 🐳 **Build & Push** | Amazon ECR | Docker build + push (backend + client images) |
| 🚀 **Deploy** | AWS EC2 | SSH + `docker compose pull` + `docker compose up -d` |

### Required GitHub Secrets

Add these in **Settings → Secrets and Variables → Actions**:

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key with ECR permissions |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | AWS region (for example, `us-east-1`) |
| `AWS_ACCOUNT_ID` | AWS account ID |
| `ECR_REPO_BACKEND` | ECR repository name for backend image |
| `ECR_REPO_CLIENT` | ECR repository name for client image |
| `REACT_APP_API_URL` | Public API base URL baked into client image |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth client ID for client build |
| `EC2_HOST` | EC2 public host or IP |
| `EC2_USER` | SSH user (for example, `ec2-user`) |
| `EC2_SSH_KEY` | Private key for SSH (PEM contents) |
| `EC2_APP_DIR` | Path to repo on EC2 (for example, `/opt/akhada-analytics`) |

---

## 🔐 Security
| 🏅 **Chris Bumstead** | Chest & Back, Shoulders & Arms, Hamstrings & Glutes, Quads & Calves, Delts & Arms |
| 💪 **Ronnie Coleman** | Chest, Back, Shoulders, Arms, Legs |
| 🔥 **Larry Wheels** | Power Bench, Power Squat, Power Deadlift, Hypertrophy Upper/Lower |
| 🧠 **Jeff Nippard** | Push, Pull, Legs (Science-based) |

Plus **6 quick-start templates**: Push Day, Pull Day, Leg Day, Upper Body, Lower Body, Full Body.

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="25%"><strong>Frontend</strong></td>
<td align="center" width="25%"><strong>Backend</strong></td>
<td align="center" width="25%"><strong>Database</strong></td>
<td align="center" width="25%"><strong>Deployment</strong></td>
</tr>
<tr>
<td align="center">
React 19<br/>
React Router 7<br/>
Zustand 5<br/>
Recharts 3<br/>
Framer Motion<br/>
Lucide React
</td>
<td align="center">
Node.js<br/>
Express 5<br/>
JWT (Access + Refresh)<br/>
Google OAuth 2.0<br/>
Helmet & Rate Limiting<br/>
bcrypt
</td>
<td align="center">
MongoDB Atlas<br/>
Mongoose 9<br/>
Connection Pooling<br/>
TTL Indexes<br/>
Compound Indexes
</td>
<td align="center">
AWS EC2 (Docker Compose)<br/>
Amazon ECR (Images)<br/>
MongoDB Atlas (DB)<br/>
GitHub Actions CI/CD<br/>
Docker Compose
</td>
</tr>
</table>

---

## 📁 Project Structure

```
Akhada Analytics/
├── .github/
│   └── workflows/
│       ├── ci.yml             # CI — lint, build, test, Docker build
│       └── deploy.yml         # CD — deploy to AWS EC2 + ECR
├── backend/
│   ├── Dockerfile             # Backend Docker image
│   ├── server.js              # Express server entry
│   ├── seed.js                # Exercise database seeder
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT + cookie auth
│   ├── models/
│   │   ├── User.js            # User schema + goals
│   │   ├── Workout.js         # Workout + exercises + sets
│   │   ├── NutritionLog.js    # Daily nutrition logs
│   │   ├── Exercise.js        # Exercise catalog
│   │   ├── PersonalRecord.js  # PR tracking
│   │   └── RefreshToken.js    # Token rotation
│   └── routes/
│       ├── auth.js            # Register, login, Google OAuth, refresh
│       ├── user.js            # Profile & goals
│       ├── workout.js         # CRUD + PR detection + muscle heatmap
│       ├── nutrition.js       # Food logging + daily summary
│       └── food.js            # Multi-cuisine food search
├── client/
│   ├── Dockerfile             # Client Docker image (multi-stage → nginx)
│   ├── .dockerignore
│   ├── src/
│   │   ├── pages/             # 9 pages (Home → Analytics)
│   │   ├── components/        # Reusable UI (Navbar, HeatMap, MacroRing...)
│   │   ├── stores/            # Zustand state (auth, workout, nutrition, toast)
│   │   ├── data/              # 500+ Indian, 200+ US, 200+ EU foods, exercises
│   │   ├── api/               # Axios instance + interceptors
│   │   └── styles/            # CSS modules per page
│   └── public/
├── .dockerignore              # Root Docker ignore
├── docker-compose.yml         # Full-stack local dev (Mongo + Backend + Client)
├── .env.example               # Backend env template
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas](https://cloud.mongodb.com))

### 1. Clone & Install

```bash
git clone https://github.com/sachinsharmaa07/Akhada-Anlaytics.git
cd Akhada-Anlaytics

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
MONGO_URI=mongodb://localhost:27017/akhada_analytics
PORT=5001
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
# Optional: comma-separated list if you use multiple Google OAuth client IDs
GOOGLE_CLIENT_IDS=your_web_client_id,your_other_client_id
```

For the frontend (`client/.env`), also set:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Seed the Exercise Database

```bash
node backend/seed.js
```

### 4. Run (Option A — Manual)

```bash
# Terminal 1 — Backend
npm run dev

# Terminal 2 — Frontend
cd client && npm start
```

Open **http://localhost:3000** 🎉

### 4. Run (Option B — Docker Compose)

Spin up everything with a single command — no local Node.js or MongoDB needed:

```bash
docker compose up --build
```

This starts:
| Container | Port | Description |
|-----------|------|-------------|
| `akhada-mongo` | `27017` | MongoDB 7 with health checks |
| `akhada-backend` | `5001` | Node.js API server |
| `akhada-client` | `3000` | React app served via nginx |

To stop: `docker compose down` · To wipe data: `docker compose down -v`

---

## 🌐 Deployment

| Service | Platform | Config |
|---------|----------|--------|
| **Backend API** | [Render](https://render.com) | `render.yaml` — auto-detected |
| **Frontend** | [Vercel](https://vercel.com) | Root directory → `client` |
| **Database** | [MongoDB Atlas](https://cloud.mongodb.com) | Free M0 cluster |

> Set `REACT_APP_API_URL` on Vercel and `CLIENT_URL` on Render to connect them.
>
> For Google Sign-In, make sure the same `REACT_APP_GOOGLE_CLIENT_ID` is used in frontend env and backend `GOOGLE_CLIENT_IDS`, and add your domains under Google Cloud Console OAuth Web Client "Authorized JavaScript origins" (e.g. `https://akhada-anlaytics.vercel.app` and `http://localhost:3000`).

---

## ⚙️ CI/CD — GitHub Actions

Two workflows automate testing and deployment on every push:

### CI — Test & Build (`.github/workflows/ci.yml`)

Runs on every **push** and **pull request**:

| Job | What it does |
|-----|--------------|
| 🔧 **Backend** | Install deps, syntax-check `server.js`, verify all route modules resolve |
| ⚛️ **Client** | Install deps, production build, run React tests |
| 🐳 **Docker** | Validate `docker compose build` succeeds |

### CD — Deploy (`.github/workflows/deploy.yml`)

Runs on push to `main` **after CI passes**:

| Job | Target | Mechanism |
|-----|--------|-----------|
| 🚀 **Backend** | Render | Deploy Hook (HTTP POST) |
| 🌐 **Client** | Vercel | Vercel CLI (`vercel deploy --prod`) |

### Required GitHub Secrets

Add these in **Settings → Secrets and Variables → Actions**:

| Secret | Where to get it |
|--------|----------------|
| `RENDER_DEPLOY_HOOK_URL` | Render Dashboard → Service → Settings → Deploy Hook |
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Run `vercel link` in `client/`, check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Same as above |

> **Note:** Both deploy jobs gracefully skip with a helpful message if the secrets are not yet configured.

---

## 🔐 Security

- 🔒 **JWT dual-token system** — 15-min access + 30-day refresh with rotation
- 🍪 **httpOnly cookies** — tokens never exposed to JavaScript
- 🛡️ **Helmet** — secure HTTP headers
- ⏱️ **Rate limiting** — 15 auth requests per 15 minutes
- 🔑 **bcrypt** — password hashing with 12 salt rounds
- 🚫 **Token reuse detection** — revokes entire token family on reuse

---

## 📊 API Endpoints

<details>
<summary><strong>Auth</strong> — <code>/api/auth</code></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Create account |
| `POST` | `/login` | Email/password login |
| `POST` | `/google` | Google OAuth |
| `POST` | `/onboarding` | Complete profile setup |
| `POST` | `/refresh` | Rotate tokens |
| `POST` | `/logout` | Revoke session |
| `GET` | `/check-username/:username` | Username availability |

</details>

<details>
<summary><strong>Workouts</strong> — <code>/api/workout</code></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Paginated workout list |
| `POST` | `/` | Log new workout (auto PR detection) |
| `GET` | `/:id` | Workout detail |
| `DELETE` | `/:id` | Delete workout |
| `GET` | `/muscles/last7days` | Muscle heatmap data |
| `GET` | `/pr` | Personal records |
| `GET` | `/exercises/search` | Search exercise DB |
| `GET` | `/last-weights` | Last-used weights |

</details>

<details>
<summary><strong>Nutrition</strong> — <code>/api/nutrition</code></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/today` | Today's log + summary |
| `POST` | `/log` | Add food items |
| `DELETE` | `/log/:mealType/:itemIndex` | Remove food item |
| `GET` | `/history` | Multi-day history |
| `GET` | `/vitamins/today` | Vitamin & mineral totals |

</details>

<details>
<summary><strong>Food Search</strong> — <code>/api/food</code></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/search` | USDA Global search |
| `GET` | `/search/indian` | Indian food DB |
| `GET` | `/search/mexican` | Mexican food DB |

</details>

---

## 🍱 Built-in Food Databases

| Cuisine | Items | Categories |
|---------|-------|------------|
| 🇮🇳 Indian | 500+ | Dal, Paneer, Biryani, Roti, Dosa, Sweets... |
| 🇺🇸 American | 200+ | Burgers, Steaks, Salads, Smoothies... |
| 🇪🇺 European | 200+ | French, Italian, German, Spanish, Greek... |
| 🌎 Global | Unlimited | USDA FoodData Central API |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **ISC License**.

---

<p align="center">
  <strong>Built with 💪 by <a href="https://github.com/sachinsharmaa07">Sachin Sharma</a></strong>
</p>

<p align="center">
  <sub>If you found this useful, consider giving it a ⭐</sub>
</p>
