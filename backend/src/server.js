import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import connectDB from './config/db.js';
import { initializeSampleStocks } from './utils/apiHelper.js';

// Import routes
import userRoutes from './routes/userRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Initialize sample stocks
setTimeout(() => {
  initializeSampleStocks();
}, 2000);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AI Stock Portfolio Optimizer API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AI Stock Portfolio Optimizer API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      stocks: '/api/stocks',
      portfolio: '/api/portfolio',
      health: '/api/health',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║   🚀 AI Stock Portfolio Optimizer API                 ║
║   📡 Server running on port ${PORT}                      ║
║   🌍 Environment: ${config.nodeEnv.padEnd(33)}║
║   📊 MongoDB: ${config.mongoUri ? 'Connected' : 'Not Connected'}                              ║
╚════════════════════════════════════════════════════════╝
  `);
});

export default app;

 
