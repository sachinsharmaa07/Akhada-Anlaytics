<p align="center">
  <img src="client/src/images/logo.png" alt="Akhada Analytics" width="80" />
</p>

<h1 align="center">Akhada Analytics</h1>

<p align="center">
  <strong>Your Personal Fitness Intelligence Platform</strong>
</p>

<p align="center">
  <a href="https://akhada-anlaytics.vercel.app">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Vercel-black?style=for-the-badge" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
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

<table>
<tr>
<td width="50%">

### 🏋️ Workout Tracking
- Log exercises with sets, reps & weight
- **Auto-fill last-used weights** for quick logging
- **Personal Record (PR) detection** — automatic
- Live workout timer with elapsed duration
- Full workout history with volume tracking

</td>
<td width="50%">

### 🍎 Nutrition Logging
- **500+ Indian foods** with full macros
- **200+ US & European foods** built-in
- USDA FoodData Central API integration
- Smart quantity converter (cups, pieces, grams)
- Meal-based logging (breakfast, lunch, dinner, snacks)

</td>
</tr>
<tr>
<td width="50%">

### 📊 Analytics Dashboard
- **BMI, TDEE, BMR** auto-calculated
- Calorie trend charts with goal lines
- Macro breakdown over time
- Workout volume progression
- Goal vs actual intake comparison

</td>
<td width="50%">

### 🧬 Body Intelligence
- **Muscle Heatmap** — 7-day frequency visualization
- **Interactive Body Visualizer** with muscle activation
- Primary, synergist & stabilizer muscle mapping
- Color-coded intensity spectrum

</td>
</tr>
</table>

---

## 🏆 Train Like Legends

Pre-built training programs from legendary athletes:

| Athlete | Splits Available |
|---------|-----------------|
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
Vercel (Frontend)<br/>
Render (Backend)<br/>
MongoDB Atlas (DB)<br/>
Auto-deploy on push
</td>
</tr>
</table>

---

## 📁 Project Structure

```
Akhada Analytics/
├── backend/
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
│   ├── src/
│   │   ├── pages/             # 9 pages (Home → Analytics)
│   │   ├── components/        # Reusable UI (Navbar, HeatMap, MacroRing...)
│   │   ├── stores/            # Zustand state (auth, workout, nutrition, toast)
│   │   ├── data/              # 500+ Indian, 200+ US, 200+ EU foods, exercises
│   │   ├── api/               # Axios instance + interceptors
│   │   └── styles/            # CSS modules per page
│   └── public/
├── render.yaml                # Render deployment blueprint
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

### 4. Run

```bash
# Terminal 1 — Backend
npm run dev

# Terminal 2 — Frontend
cd client && npm start
```

Open **http://localhost:3000** 🎉

---

## 🌐 Deployment

| Service | Platform | Config |
|---------|----------|--------|
| **Backend API** | [Render](https://render.com) | `render.yaml` — auto-detected |
| **Frontend** | [Vercel](https://vercel.com) | Root directory → `client` |
| **Database** | [MongoDB Atlas](https://cloud.mongodb.com) | Free M0 cluster |

> Set `REACT_APP_API_URL` on Vercel and `CLIENT_URL` on Render to connect them.

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
