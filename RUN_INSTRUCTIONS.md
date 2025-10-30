# 🎯 Complete Run Instructions

## 📋 Prerequisites

Before running the application, ensure you have:

1. **Node.js** (v16 or higher)
   ```bash
   node --version
   # Should show v16.x.x or higher
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **MongoDB** (local installation OR MongoDB Atlas account)
   - Local: Download from https://www.mongodb.com/try/download/community
   - Cloud: Sign up at https://www.mongodb.com/cloud/atlas

## 🚀 Step-by-Step Setup

### Step 1: Navigate to Project Directory
```bash
cd C:\Users\ankit\OneDrive\Desktop\AI-STOCK_OPTIMIZER
```

### Step 2: Install Root Dependencies
```bash
npm install
```

### Step 3: Install All Project Dependencies
```bash
npm run install:all
```

This will install dependencies for both backend and frontend.

### Step 4: Configure Backend Environment

1. Navigate to backend directory:
```bash
cd backend
```

2. Copy the example environment file:
```bash
copy .env.example .env
```

3. Edit the `.env` file with your preferred text editor:
```bash
notepad .env
```

4. Update the following values:

**For Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/stock-optimizer
JWT_SECRET=your_random_secret_key_here_change_this
ALPHAVANTAGE_API_KEY=
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/stock-optimizer
JWT_SECRET=your_random_secret_key_here_change_this
ALPHAVANTAGE_API_KEY=
PORT=5000
NODE_ENV=development
```

**Important Notes:**
- Replace `JWT_SECRET` with a random string (e.g., use a password generator)
- `ALPHAVANTAGE_API_KEY` is optional - leave empty to use mock data
- Keep `PORT=5000` unless you have a conflict

### Step 5: Start MongoDB (if using local)

**Windows:**
```bash
# Open a new terminal and run:
mongod
```

**Mac/Linux:**
```bash
# Open a new terminal and run:
sudo mongod
```

Leave this terminal running.

### Step 6: Run the Application

Go back to the root project directory:
```bash
cd C:\Users\ankit\OneDrive\Desktop\AI-STOCK_OPTIMIZER
```

**Option A: Run Both Servers Together (Recommended)**
```bash
npm run dev
```

**Option B: Run Servers Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Step 7: Access the Application

Once both servers are running, you'll see:

```
Backend running on: http://localhost:5000
Frontend running on: http://localhost:5173
```

Open your browser and go to:
**http://localhost:5173**

## 🎮 Using the Application

### First Time Setup

1. **Register an Account**
   - Click "Get Started" or "Register"
   - Fill in:
     - Name: Your full name
     - Email: your@email.com
     - Password: At least 6 characters
     - Risk Tolerance: Choose Low, Medium, or High
   - Click "Create Account"

2. **You'll be automatically logged in and redirected to the Dashboard**

### Creating Your First Portfolio

1. **From the Dashboard:**
   - Click "Create New Portfolio" button
   - You'll be redirected to the portfolio builder

2. **Fill in Portfolio Details:**
   - **Portfolio Name:** e.g., "My First Portfolio"
   - **Total Budget:** e.g., 10000 (for $10,000)
   - **Risk Level:** Choose Low, Medium, or High
   - **Algorithm:** Choose Greedy (fast) or Knapsack (optimal)

3. **Select Stocks (Optional):**
   - You can select specific stocks by clicking on them
   - Or leave all unselected to use all available stocks
   - Selected stocks will have a blue border

4. **Create Portfolio:**
   - Click "Create Portfolio" button
   - Wait for optimization (usually 1-2 seconds)
   - You'll be redirected to your portfolio details

### Viewing Portfolio Details

Your portfolio page shows:
- **Summary Stats:** Budget, Expected Return, Risk Score, Diversification
- **Allocation Pie Chart:** Visual distribution of investments
- **Returns Bar Chart:** Expected returns per stock
- **Sector Distribution:** Breakdown by industry sector
- **Holdings Table:** Detailed list of all stocks

### Managing Portfolios

- **View All Portfolios:** Go to Dashboard
- **View Specific Portfolio:** Click on any portfolio card
- **Delete Portfolio:** Click "Delete" button on portfolio page
- **Create Multiple Portfolios:** Repeat the creation process

## 🔍 Testing the Application

### Test Scenario 1: Conservative Investor
```
Budget: $5,000
Risk Level: Low
Algorithm: Greedy
Expected: Low volatility stocks, well diversified
```

### Test Scenario 2: Aggressive Investor
```
Budget: $50,000
Risk Level: High
Algorithm: Knapsack
Expected: High return stocks, may be concentrated
```

### Test Scenario 3: Balanced Approach
```
Budget: $20,000
Risk Level: Medium
Algorithm: Greedy
Expected: Mix of stocks, balanced risk/return
```

### Test Scenario 4: Algorithm Comparison
Create two portfolios with same settings but different algorithms:
```
Portfolio 1: Greedy algorithm
Portfolio 2: Knapsack algorithm
Compare the allocations and returns
```

## 🛠️ Troubleshooting

### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Make sure MongoDB is running:
   ```bash
   mongod
   ```
2. Check if MongoDB is installed correctly
3. Or use MongoDB Atlas instead (cloud database)

### Issue: Port 5000 Already in Use
```
Error: Port 5000 is already in use
```

**Solution:**
1. Find and kill the process:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID_NUMBER> /F
   ```

2. Or change the port in `backend/.env`:
   ```env
   PORT=5001
   ```

### Issue: Port 5173 Already in Use
```
Error: Port 5173 is already in use
```

**Solution:**
1. Kill the process or let Vite choose another port
2. Vite will automatically suggest an alternative port

### Issue: Cannot Login/Register
```
Network Error or 401 Unauthorized
```

**Solution:**
1. Check if backend is running on http://localhost:5000
2. Check browser console for errors
3. Verify MongoDB is connected
4. Check backend terminal for error messages

### Issue: No Stocks Showing
```
Empty stock list on dashboard
```

**Solution:**
1. Wait 2-3 seconds after backend starts (stocks are being initialized)
2. Check backend terminal for "Sample stocks initialized" message
3. Refresh the page
4. Check MongoDB connection

### Issue: Portfolio Creation Fails
```
Error creating portfolio
```

**Solution:**
1. Ensure budget is greater than 0
2. Check if you're logged in (token not expired)
3. Verify at least one stock is available
4. Check backend logs for specific error

### Issue: Charts Not Displaying
```
Blank charts or errors
```

**Solution:**
1. Check if portfolio has allocations
2. Verify Recharts is installed:
   ```bash
   cd frontend
   npm install recharts
   ```
3. Clear browser cache and refresh

## 📊 Verifying Everything Works

### Backend Health Check
Open browser and go to:
```
http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "AI Stock Portfolio Optimizer API is running",
  "timestamp": "2024-..."
}
```

### Get All Stocks
```
http://localhost:5000/api/stocks
```

Should return JSON with stock list.

### Frontend Check
```
http://localhost:5173
```

Should show the landing page with "Optimize Your Stock Portfolio" heading.

## 🔄 Stopping the Application

### If Running with `npm run dev`:
Press `Ctrl + C` in the terminal

### If Running Separately:
Press `Ctrl + C` in both terminals (backend and frontend)

### Stop MongoDB:
Press `Ctrl + C` in the MongoDB terminal

## 🔁 Restarting the Application

Simply run again:
```bash
# Make sure MongoDB is running
mongod

# In another terminal, from project root:
npm run dev
```

## 📝 Development Mode vs Production

### Development Mode (Current Setup)
- Hot reload enabled
- Detailed error messages
- Source maps available
- CORS enabled for localhost

### Production Mode (Future)
- Build optimized bundles
- Minified code
- Environment-specific configs
- Deploy to cloud services

## 🎓 Next Steps

1. **Explore the Code:**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`
   - Algorithms: `backend/src/utils/optimizer.js`

2. **Customize:**
   - Add more stocks
   - Modify algorithms
   - Change UI theme
   - Add new features

3. **Learn:**
   - Study the Greedy algorithm implementation
   - Understand the Knapsack algorithm
   - Explore React patterns
   - Learn MongoDB queries

## 📞 Getting Help

If you encounter issues:
1. Check this troubleshooting section
2. Review error messages in terminal
3. Check browser console (F12)
4. Verify all prerequisites are met
5. Ensure all dependencies are installed

## ✅ Success Checklist

Before considering setup complete, verify:

- [ ] Node.js and npm are installed
- [ ] MongoDB is running (or Atlas is configured)
- [ ] Backend dependencies installed (`backend/node_modules` exists)
- [ ] Frontend dependencies installed (`frontend/node_modules` exists)
- [ ] `.env` file created in backend directory
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can access http://localhost:5173
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Can see stocks on dashboard
- [ ] Can create a portfolio
- [ ] Can view portfolio details
- [ ] Charts display correctly

---

## 🎉 You're All Set!

If all checks pass, you're ready to start optimizing portfolios!

**Happy Investing! 📈💰**
