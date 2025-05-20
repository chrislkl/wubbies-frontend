# 🧸 Wubbies

A collectible character web app where users roll for randomized "Wubbies", view their collection, and persist everything securely in the cloud.

### 🌐 Live Demo  
https://wubbies.vercel.app/

---

## 🚀 Features

- 🎒 **Personal Wallet**: Each user has a persistent collection of Wubbies
- 🔒 **Authentication**: Secure Clerk-powered login with JWT-based API protection
- ☁️ **Cloud-Hosted**: Fully deployed on Render (backend) and Vercel (frontend)
- 🎨 **Visual Showcase**: Rolled Wubbies are displayed with image and rarity

---

## 🛠 Tech Stack

### Frontend
- **Vite + React + TypeScript**
- **Clerk** (for auth)
- **CSS Modules / plain CSS**
- **Deployed on Vercel**

### Backend
- **Node.js + Express**
- **Prisma (ORM)**
- **Clerk Express SDK (JWT validation)**
- **CORS-secured REST API**
- **Deployed on Render**

### Database
- **PostgreSQL** hosted on **Railway**
- Prisma models: `User`, `Wubbie`, `WubbieInstance`

---

## 💼 What This Showcases

- Fullstack project architecture (frontend, backend, database)
- Secure authentication flow using Clerk (JWT-based)
- Dynamic state handling in React + persistent user data
- Prisma schema design, seeding, and deployment to a real Postgres DB
- Deployment pipelines with Vercel + Render + Railway
- Real-world API integration and CORS handling

---

## ⚙️ Local Development

1. Clone this repo
2. Add a `.env` file to both frontend and backend:

### Frontend (`wubbies-frontend/.env`)
VITE_API_BASE_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

### Backend (`wubbies-backend/.env`)
DATABASE_URL=your_postgres_url
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

3. Run the backend:
```bash
cd wubbies-backend
npm install
npx prisma db push
npm run dev
```

4. Run the frontend:
cd wubbies-frontend
npm install
npm run dev


by Chris Lew
