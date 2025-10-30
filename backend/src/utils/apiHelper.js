import axios from 'axios';
import config from '../config/env.js';
import Stock from '../models/Stock.js';

/**
 * Mock stock data for testing when API key is not available
 */
const mockStockData = {
  AAPL: { name: 'Apple Inc.', price: 178.5, expectedReturn: 12.5, volatility: 22.3, sector: 'Technology' },
  MSFT: { name: 'Microsoft Corp.', price: 375.2, expectedReturn: 14.2, volatility: 20.1, sector: 'Technology' },
  GOOGL: { name: 'Alphabet Inc.', price: 140.8, expectedReturn: 13.8, volatility: 24.5, sector: 'Technology' },
  AMZN: { name: 'Amazon.com Inc.', price: 152.3, expectedReturn: 15.1, volatility: 28.7, sector: 'Consumer Cyclical' },
  TSLA: { name: 'Tesla Inc.', price: 242.8, expectedReturn: 18.5, volatility: 45.2, sector: 'Automotive' },
  JPM: { name: 'JPMorgan Chase', price: 158.9, expectedReturn: 10.2, volatility: 18.5, sector: 'Financial' },
  JNJ: { name: 'Johnson & Johnson', price: 162.4, expectedReturn: 8.5, volatility: 12.3, sector: 'Healthcare' },
  V: { name: 'Visa Inc.', price: 258.7, expectedReturn: 11.8, volatility: 19.2, sector: 'Financial' },
  WMT: { name: 'Walmart Inc.', price: 165.3, expectedReturn: 9.2, volatility: 15.8, sector: 'Consumer Defensive' },
  PG: { name: 'Procter & Gamble', price: 152.1, expectedReturn: 7.8, volatility: 13.5, sector: 'Consumer Defensive' },
  NVDA: { name: 'NVIDIA Corp.', price: 495.2, expectedReturn: 22.5, volatility: 38.9, sector: 'Technology' },
  DIS: { name: 'Walt Disney Co.', price: 95.8, expectedReturn: 10.5, volatility: 25.3, sector: 'Communication' },
  BA: { name: 'Boeing Co.', price: 215.4, expectedReturn: 11.2, volatility: 32.1, sector: 'Industrials' },
  NFLX: { name: 'Netflix Inc.', price: 445.3, expectedReturn: 16.8, volatility: 35.6, sector: 'Communication' },
  KO: { name: 'Coca-Cola Co.', price: 59.2, expectedReturn: 6.5, volatility: 11.2, sector: 'Consumer Defensive' },
};

/**
 * Fetch stock data from AlphaVantage API
 */
export const fetchStockFromAPI = async (symbol) => {
  if (!config.alphaVantageApiKey) {
    console.log(`⚠️  No API key found, using mock data for ${symbol}`);
    return mockStockData[symbol] || null;
  }

  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${config.alphaVantageApiKey}`;
    const response = await axios.get(url);

    const quote = response.data['Global Quote'];
    if (!quote || !quote['05. price']) {
      throw new Error('Invalid response from API');
    }

    // Calculate simple metrics (in production, use historical data)
    const price = parseFloat(quote['05. price']);
    const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));

    return {
      name: symbol,
      price: price,
      expectedReturn: Math.abs(changePercent) * 2, // Simplified calculation
      volatility: Math.abs(changePercent) * 1.5,
      sector: 'Unknown',
    };
  } catch (error) {
    console.error(`Error fetching stock ${symbol}:`, error.message);
    // Fallback to mock data
    return mockStockData[symbol] || null;
  }
};

/**
 * Get or create stock in database
 */
export const getOrCreateStock = async (symbol) => {
  try {
    // Check if stock exists in database
    let stock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    // If stock exists and was updated recently (within 1 hour), return it
    if (stock && Date.now() - stock.lastUpdated < 3600000) {
      return stock;
    }

    // Fetch fresh data from API
    const stockData = await fetchStockFromAPI(symbol.toUpperCase());

    if (!stockData) {
      throw new Error(`Stock ${symbol} not found`);
    }

    // Update or create stock
    if (stock) {
      stock.price = stockData.price;
      stock.expectedReturn = stockData.expectedReturn;
      stock.volatility = stockData.volatility;
      stock.sector = stockData.sector;
      stock.lastUpdated = Date.now();
      await stock.save();
    } else {
      stock = await Stock.create({
        symbol: symbol.toUpperCase(),
        name: stockData.name,
        price: stockData.price,
        expectedReturn: stockData.expectedReturn,
        volatility: stockData.volatility,
        sector: stockData.sector,
      });
    }

    return stock;
  } catch (error) {
    throw new Error(`Failed to get stock data: ${error.message}`);
  }
};

/**
 * Get multiple stocks
 */
export const getMultipleStocks = async (symbols) => {
  const stocks = [];
  
  for (const symbol of symbols) {
    try {
      const stock = await getOrCreateStock(symbol);
      stocks.push(stock);
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error.message);
    }
  }

  return stocks;
};

/**
 * Initialize database with sample stocks
 */
export const initializeSampleStocks = async () => {
  try {
    const count = await Stock.countDocuments();
    
    if (count === 0) {
      console.log('📊 Initializing sample stocks...');
      const symbols = Object.keys(mockStockData);
      await getMultipleStocks(symbols);
      console.log('✅ Sample stocks initialized');
    }
  } catch (error) {
    console.error('Error initializing sample stocks:', error.message);
  }
};
