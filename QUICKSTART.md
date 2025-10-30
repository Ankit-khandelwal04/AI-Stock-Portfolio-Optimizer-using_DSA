# ⚡ Quick Start (5 Minutes)

## 1. Install Everything
```bash
cd AI-STOCK_OPTIMIZER
npm install
npm run install:all
```

## 2. Setup Backend Environment
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/stock-optimizer
JWT_SECRET=change_this_to_random_secret_key
PORT=5000
```

## 3. Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

## 4. Run the App
```bash
# From root directory
npm run dev
```

## 5. Open Browser
Go to: **http://localhost:5173**

## 6. Create Account & Portfolio
1. Click "Get Started"
2. Register with email/password
3. Login
4. Click "Create New Portfolio"
5. Set budget: $10,000
6. Choose risk: Medium
7. Click "Create Portfolio"
8. View your optimized portfolio! 🎉

---

## Without MongoDB?

**Use MongoDB Atlas (Free Cloud Database):**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create cluster (free tier)
4. Get connection string
5. Update `MONGO_URI` in `.env`

Example:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/stock-optimizer
```

---

## Ports
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

---

**That's it! You're ready to optimize portfolios! 📈**
