import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment configuration
 */
const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/stock-optimizer',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_change_in_production',
  alphaVantageApiKey: process.env.ALPHAVANTAGE_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
