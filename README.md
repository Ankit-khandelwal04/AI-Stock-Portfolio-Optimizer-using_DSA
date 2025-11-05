# 🚀 AI Stock Portfolio Optimizer

A full-stack web application that helps users build optimized stock portfolios based on risk tolerance and budget using **Data Structures & Algorithms** (Greedy and Knapsack optimization).

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Algorithms](#algorithms)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - JWT-based secure login/registration
- 📊 **Portfolio Optimization** - DSA-based algorithms (Greedy & Knapsack)
- 💰 **Budget Management** - Allocate capital efficiently across stocks
- 🎯 **Risk Management** - Customize portfolios by risk tolerance (Low/Medium/High)
- 📈 **Live Stock Data** - Integration with AlphaVantage API (with mock fallback)
- 🔄 **Portfolio CRUD** - Create, read, update, and delete portfolios
- 📉 **Data Visualization** - Interactive charts using Recharts
- 🎨 **Modern UI** - Responsive design with Tailwind CSS

### Advanced Features
- ✅ Sector-based diversification scoring
- ✅ Real-time expected returns calculation
- ✅ Risk-adjusted portfolio allocation
- ✅ Multiple optimization algorithms
- ✅ Stock search and filtering
- ✅ Portfolio performance metrics

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Axios** - External API calls

### External APIs
- **AlphaVantage** - Stock market data (optional)

## 📂 Project Structure

```
ai-stock-portfolio-optimizer/
│
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── StockCard.jsx
│   │   │   └── PortfolioChart.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── PortfolioPage.jsx
│   │   ├── context/            # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── utils/              # Utilities
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Node.js backend
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   │   ├── userController.js
│   │   │   ├── stockController.js
│   │   │   └── portfolioController.js
│   │   ├── models/             # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Stock.js
│   │   │   └── Portfolio.js
│   │   ├── routes/             # API routes
│   │   │   ├── userRoutes.js
│   │   │   ├── stockRoutes.js
│   │   │   └── portfolioRoutes.js
│   │   ├── utils/              # Utility functions
│   │   │   ├── optimizer.js    # DSA algorithms
│   │   │   └── apiHelper.js
│   │   ├── config/             # Configuration
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── middleware/         # Middleware
│   │   │   └── auth.js
│   │   └── server.js           # Entry point
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🚀 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd ai-stock-portfolio-optimizer
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Create a `.env` file in the `backend` directory:
```bash
cd backend
cp .env.example .env
```

2. Edit `.env` with your configuration:
```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/stock-optimizer

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# AlphaVantage API Key (optional - app works with mock data)
ALPHAVANTAGE_API_KEY=your_alphavantage_api_key_here

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

### Getting AlphaVantage API Key (Optional)
1. Visit [AlphaVantage](https://www.alphavantage.co/support/#api-key)
2. Get your free API key
3. Add it to `.env`

**Note:** The app includes mock stock data and works without an API key!

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

## 🏃 Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Option 2: Run with Concurrently (Recommended)

Create a root `package.json`:
```json
{
  "name": "ai-stock-optimizer",
  "scripts": {
    "install:all": "cd backend && npm install && cd ../frontend && npm install",
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
    "start:backend": "cd backend && npm start",
    "start:frontend": "cd frontend && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Then run:
```bash
npm install
npm run dev
```

## 📡 API Documentation

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/register` | Register new user | No |
| POST | `/api/users/login` | Login user | No |
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update profile | Yes |

### Stock Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/stocks` | Get all stocks | No |
| GET | `/api/stocks/:symbol` | Get stock by symbol | No |
| GET | `/api/stocks/search/:query` | Search stocks | No |
| POST | `/api/stocks/batch` | Get multiple stocks | No |
| GET | `/api/stocks/sectors/list` | Get sectors | No |

### Portfolio Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/portfolio/optimize` | Create optimized portfolio | Yes |
| GET | `/api/portfolio` | Get user portfolios | Yes |
| GET | `/api/portfolio/:id` | Get portfolio by ID | Yes |
| PUT | `/api/portfolio/:id` | Update portfolio | Yes |
| DELETE | `/api/portfolio/:id` | Delete portfolio | Yes |
| GET | `/api/portfolio/:id/stats` | Get portfolio stats | Yes |

## 🧮 Algorithms

### 1. Greedy Algorithm
**Time Complexity:** O(n log n)

- Sorts stocks by risk-adjusted return
- Greedily selects best stocks until budget exhausted
- Fast and efficient for large datasets
- Ensures diversification (max 30% per stock)

### 2. Knapsack Algorithm (0/1 Variant)
**Time Complexity:** O(n × W)

- Uses dynamic programming
- Finds optimal combination of stocks
- More accurate but slower for large budgets
- Recommended for budgets < $100,000

### Risk-Adjusted Return Calculation
```javascript
score = expectedReturn / (1 + volatility × riskPenalty / 100)
```

Risk penalties:
- **Low risk:** 2.0 (high penalty for volatility)
- **Medium risk:** 1.0 (moderate penalty)
- **High risk:** 0.5 (low penalty, risk-tolerant)

### Diversification Score
- Based on number of sectors and stocks
- Sector diversity: up to 60 points
- Stock count: up to 40 points
- Maximum score: 100

## 🎨 Usage Guide

### 1. Register/Login
- Create an account with email and password
- Set your risk tolerance level

### 2. Create Portfolio
- Navigate to Dashboard
- Click "Create New Portfolio"
- Set budget and risk level
- Choose optimization algorithm
- Optionally select specific stocks
- Click "Create Portfolio"

### 3. View Portfolio
- See allocation pie chart
- View expected returns bar chart
- Check sector distribution
- Review individual holdings

### 4. Manage Portfolios
- Update portfolio name
- Archive old portfolios
- Delete portfolios

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS enabled
- ✅ Environment variables for secrets

## 🧪 Testing

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "riskTolerance": "medium"
  }'
```

### Test Portfolio Optimization
```bash
curl -X POST http://localhost:5000/api/portfolio/optimize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Portfolio",
    "totalBudget": 10000,
    "riskLevel": "medium",
    "algorithm": "greedy"
  }'
```

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret for JWT signing | Yes | - |
| `ALPHAVANTAGE_API_KEY` | AlphaVantage API key | No | Mock data used |
| `PORT` | Backend server port | No | 5000 |
| `NODE_ENV` | Environment mode | No | development |

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
mongod
```

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change PORT in .env
PORT=5001
```

### API Key Issues
- App works without AlphaVantage API key
- Mock data is automatically used as fallback
- Check console for API-related warnings

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Ankit Khandelwal

## 🙏 Acknowledgments

- AlphaVantage for stock market data API
- MongoDB for database
- React and Node.js communities

---

**Happy Investing! 📈💰**
