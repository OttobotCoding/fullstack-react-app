# 🚀 Full-Stack Contact Form App

A complete full-stack application with a React frontend and Node.js/Express backend connected to a MySQL database.

**Stack:** React · Node.js · Express · MySQL 2

---

## 📁 Project Structure

```
fullstack-app/
├── frontend/          # React app (deploys to GitHub Pages)
│   ├── public/
│   └── src/
│       ├── App.jsx    # Main app with form + records view
│       └── index.js
├── backend/           # Express API (deploys to Railway/Render)
│   ├── server.js      # API routes + MySQL connection
│   └── .env.example
├── schema.sql         # MySQL table definition
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MySQL 8+ running locally

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd fullstack-app
```

### 2. Set up the database
```bash
mysql -u root -p < schema.sql
```

### 3. Configure the backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run dev
# Backend runs at http://localhost:5000
```

### 4. Configure the frontend
```bash
cd ../frontend
cp .env.example .env
# .env already points to http://localhost:5000
npm install
npm start
# Frontend runs at http://localhost:3000
```

---

## 🌐 Deploying to GitHub (Free Hosting)

### Frontend → GitHub Pages

1. **Update `homepage`** in `frontend/package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO"
   ```

2. **Point to your live backend** in `frontend/.env`:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```

3. **Deploy:**
   ```bash
   cd frontend
   npm install
   npm run deploy
   ```
   > This runs `gh-pages -d build` which pushes to the `gh-pages` branch.

4. In your GitHub repo → **Settings → Pages**, set source to `gh-pages` branch.

### Backend → Railway (Recommended — Free Tier)

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project → Deploy from GitHub repo** → select this repo.
3. Set the **root directory** to `backend`.
4. Add a **MySQL** plugin to your project.
5. Set environment variables (Railway auto-provides DB vars for the plugin):
   ```
   DB_HOST     = (from Railway MySQL plugin)
   DB_USER     = (from Railway MySQL plugin)
   DB_PASSWORD = (from Railway MySQL plugin)
   DB_NAME     = (from Railway MySQL plugin)
   DB_PORT     = (from Railway MySQL plugin)
   FRONTEND_URL = https://YOUR_USERNAME.github.io/YOUR_REPO
   ```
6. Railway will auto-detect `npm start` and deploy.

### Backend → Render (Alternative Free Option)

1. Go to [render.com](https://render.com) → **New Web Service**.
2. Connect your GitHub repo, set **Root Directory** to `backend`.
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables matching your MySQL provider (e.g., [PlanetScale](https://planetscale.com) or [Aiven](https://aiven.io) for free MySQL).

---

## 🔌 API Endpoints

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | `/api/health`      | Health check             |
| GET    | `/api/contacts`    | Get all contacts         |
| POST   | `/api/contacts`    | Create a new contact     |
| DELETE | `/api/contacts/:id`| Delete a contact by ID   |

### POST `/api/contacts` — Request Body
```json
{
  "name":    "Jane Smith",
  "email":   "jane@example.com",
  "phone":   "+1-555-0100",
  "subject": "General Inquiry",
  "message": "Hello there!"
}
```

---

## 🛡️ Features

- **Form Validation** — client-side + server-side (express-validator)
- **Live Records View** — browse and delete all database entries
- **MySQL Connection Pool** — efficient, safe database connections
- **CORS Configured** — locked to your frontend URL in production
- **Auto Table Init** — database table created automatically on first run
- **Toast Notifications** — success/error feedback
- **Responsive Design** — works on mobile and desktop

---

## 🗄️ Database Schema

```sql
CREATE TABLE contacts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  phone      VARCHAR(50),
  subject    VARCHAR(255) NOT NULL,
  message    TEXT         NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📄 License

MIT — free to use and modify.
