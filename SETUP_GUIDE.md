# 🚀 Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v16+ installed (`node --version`)
- ✅ MongoDB installed or MongoDB Atlas account
- ✅ npm or yarn package manager

## Step-by-Step Setup

### 1️⃣ Install Dependencies

**Option A: Install All at Once (Recommended)**
```bash
cd AI-STOCK_OPTIMIZER
npm install
npm run install:all
```

**Option B: Install Separately**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2️⃣ Setup MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod

# MongoDB will run on mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Use this in your `.env` file

### 3️⃣ Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/stock-optimizer
JWT_SECRET=my_super_secret_key_12345
ALPHAVANTAGE_API_KEY=                    # Optional - leave empty for mock data
PORT=5000
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a random secure string!

### 4️⃣ Run the Application

**Option A: Run Both Servers Together (Recommended)**
```bash
# From root directory
npm run dev
```

**Option B: Run Separately**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 5️⃣ Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## 🎯 First Time Usage

1. **Register Account**
   - Go to http://localhost:5173
   - Click "Get Started" or "Register"
   - Fill in your details
   - Choose risk tolerance

2. **Create Portfolio**
   - Login to your account
   - Click "Create New Portfolio"
   - Set budget (e.g., $10,000)
   - Choose risk level
   - Select optimization algorithm
   - Click "Create Portfolio"

3. **View Results**
   - See optimized stock allocations
   - View charts and analytics
   - Check diversification score

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service
```bash
mongod
```

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution:** Kill the process or change port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=5001
```

### Frontend Can't Connect to Backend
**Solution:** Check CORS and proxy settings
- Backend should have CORS enabled (already configured)
- Frontend proxy in `vite.config.js` should point to backend

### Missing Dependencies
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📊 Sample Data

The app automatically initializes with 15 sample stocks:
- AAPL, MSFT, GOOGL, AMZN, TSLA
- JPM, JNJ, V, WMT, PG
- NVDA, DIS, BA, NFLX, KO

You can use these for testing without an API key!

## 🧪 Testing the API

### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"riskTolerance\":\"medium\"}"
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Get Stocks
```bash
curl http://localhost:5000/api/stocks
```

## 🎨 Features to Try

1. **Different Risk Levels**
   - Create portfolios with Low, Medium, High risk
   - Compare the allocations

2. **Budget Variations**
   - Try $1,000, $10,000, $100,000
   - See how algorithm adapts

3. **Algorithm Comparison**
   - Create same portfolio with Greedy
   - Create same portfolio with Knapsack
   - Compare results

4. **Stock Selection**
   - Create portfolio with all stocks
   - Create portfolio with selected stocks only
   - Compare diversification scores

## 📱 Browser Compatibility

Tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🔐 Security Notes

For Production:
1. Change `JWT_SECRET` to a strong random string
2. Use MongoDB Atlas with authentication
3. Enable HTTPS
4. Add rate limiting
5. Implement input sanitization
6. Use environment-specific configs

## 📞 Need Help?

Common issues:
1. **Can't login:** Check if backend is running
2. **No stocks showing:** Check MongoDB connection
3. **Portfolio creation fails:** Check budget > 0 and valid risk level
4. **Charts not showing:** Check if Recharts is installed

## ✅ Success Checklist

- [ ] MongoDB is running
- [ ] Backend server started (port 5000)
- [ ] Frontend server started (port 5173)
- [ ] Can access http://localhost:5173
- [ ] Can register new user
- [ ] Can login
- [ ] Can see stocks on dashboard
- [ ] Can create portfolio
- [ ] Can view portfolio details

---

**You're all set! Happy optimizing! 🎉**
