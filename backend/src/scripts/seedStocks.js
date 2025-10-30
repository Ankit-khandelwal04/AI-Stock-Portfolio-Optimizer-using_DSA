import mongoose from 'mongoose';
import Stock from '../models/Stock.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleStocks = [
  // Technology Sector
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, expectedReturn: 12.5, volatility: 22.3, sector: 'Technology', marketCap: 2800000000000 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 380.25, expectedReturn: 11.8, volatility: 20.5, sector: 'Technology', marketCap: 2850000000000 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.75, expectedReturn: 13.2, volatility: 24.1, sector: 'Technology', marketCap: 1750000000000 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 495.30, expectedReturn: 18.5, volatility: 35.2, sector: 'Technology', marketCap: 1220000000000 },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 325.80, expectedReturn: 14.7, volatility: 28.9, sector: 'Technology', marketCap: 850000000000 },
  
  // Finance Sector
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 155.40, expectedReturn: 9.5, volatility: 18.7, sector: 'Finance', marketCap: 450000000000 },
  { symbol: 'BAC', name: 'Bank of America Corp.', price: 32.85, expectedReturn: 8.9, volatility: 21.4, sector: 'Finance', marketCap: 250000000000 },
  { symbol: 'WFC', name: 'Wells Fargo & Company', price: 48.20, expectedReturn: 8.2, volatility: 19.8, sector: 'Finance', marketCap: 180000000000 },
  { symbol: 'GS', name: 'Goldman Sachs Group Inc.', price: 385.90, expectedReturn: 10.3, volatility: 23.5, sector: 'Finance', marketCap: 130000000000 },
  
  // Healthcare Sector
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 158.75, expectedReturn: 7.8, volatility: 14.2, sector: 'Healthcare', marketCap: 390000000000 },
  { symbol: 'UNH', name: 'UnitedHealth Group Inc.', price: 520.40, expectedReturn: 10.5, volatility: 17.6, sector: 'Healthcare', marketCap: 490000000000 },
  { symbol: 'PFE', name: 'Pfizer Inc.', price: 28.95, expectedReturn: 6.5, volatility: 16.3, sector: 'Healthcare', marketCap: 160000000000 },
  { symbol: 'ABBV', name: 'AbbVie Inc.', price: 165.30, expectedReturn: 9.2, volatility: 15.8, sector: 'Healthcare', marketCap: 290000000000 },
  
  // Consumer Goods
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.60, expectedReturn: 15.3, volatility: 26.7, sector: 'Consumer Goods', marketCap: 1500000000000 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.80, expectedReturn: 20.5, volatility: 42.8, sector: 'Consumer Goods', marketCap: 780000000000 },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 165.25, expectedReturn: 7.2, volatility: 13.5, sector: 'Consumer Goods', marketCap: 450000000000 },
  { symbol: 'PG', name: 'Procter & Gamble Co.', price: 155.90, expectedReturn: 6.8, volatility: 12.9, sector: 'Consumer Goods', marketCap: 370000000000 },
  
  // Energy Sector
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', price: 108.75, expectedReturn: 8.5, volatility: 20.4, sector: 'Energy', marketCap: 450000000000 },
  { symbol: 'CVX', name: 'Chevron Corporation', price: 152.30, expectedReturn: 8.8, volatility: 19.7, sector: 'Energy', marketCap: 290000000000 },
  
  // Industrial
  { symbol: 'BA', name: 'Boeing Company', price: 185.40, expectedReturn: 11.2, volatility: 31.5, sector: 'Industrial', marketCap: 110000000000 },
  { symbol: 'CAT', name: 'Caterpillar Inc.', price: 295.60, expectedReturn: 9.7, volatility: 22.8, sector: 'Industrial', marketCap: 155000000000 },
  
  // Telecommunications
  { symbol: 'T', name: 'AT&T Inc.', price: 16.45, expectedReturn: 5.5, volatility: 15.2, sector: 'Telecommunications', marketCap: 120000000000 },
  { symbol: 'VZ', name: 'Verizon Communications', price: 38.90, expectedReturn: 6.2, volatility: 14.8, sector: 'Telecommunications', marketCap: 160000000000 },
  
  // Real Estate
  { symbol: 'AMT', name: 'American Tower Corp.', price: 195.75, expectedReturn: 8.9, volatility: 18.3, sector: 'Real Estate', marketCap: 90000000000 },
  
  // Materials
  { symbol: 'LIN', name: 'Linde plc', price: 425.30, expectedReturn: 9.4, volatility: 17.9, sector: 'Materials', marketCap: 210000000000 },
];

const seedStocks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing stocks
    await Stock.deleteMany({});
    console.log('Cleared existing stocks');

    // Insert sample stocks
    await Stock.insertMany(sampleStocks);
    console.log(`Successfully seeded ${sampleStocks.length} stocks`);

    // Verify the data
    const count = await Stock.countDocuments();
    console.log(`Total stocks in database: ${count}`);

    // Display some sample stocks
    const samples = await Stock.find().limit(5);
    console.log('\nSample stocks:');
    samples.forEach(stock => {
      console.log(`${stock.symbol} - ${stock.name}: $${stock.price}, Return: ${stock.expectedReturn}%, Volatility: ${stock.volatility}%`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding stocks:', error);
    process.exit(1);
  }
};

seedStocks();
