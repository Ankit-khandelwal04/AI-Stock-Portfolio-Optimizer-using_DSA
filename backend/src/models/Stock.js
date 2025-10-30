import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    expectedReturn: {
      type: Number,
      required: true,
      default: 0,
    },
    volatility: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },
    sector: {
      type: String,
      default: 'Unknown',
    },
    marketCap: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    historicalData: [
      {
        date: Date,
        close: Number,
        volume: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
stockSchema.index({ symbol: 1 });
stockSchema.index({ sector: 1 });

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
