import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'My Portfolio',
    },
    totalBudget: {
      type: Number,
      required: true,
      min: 0,
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
      default: 'medium',
    },
    allocations: [
      {
        stock: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Stock',
        },
        symbol: String,
        name: String,
        shares: Number,
        investedAmount: Number,
        expectedReturn: Number,
        weight: Number, // Percentage of portfolio
      },
    ],
    totalExpectedReturn: {
      type: Number,
      default: 0,
    },
    totalRisk: {
      type: Number,
      default: 0,
    },
    diversificationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
portfolioSchema.index({ user: 1, status: 1 });

// Pre-save hook to validate and sanitize data
portfolioSchema.pre('save', function(next) {
  // Ensure no NaN values
  if (isNaN(this.totalExpectedReturn)) {
    this.totalExpectedReturn = 0;
  }
  if (isNaN(this.totalRisk)) {
    this.totalRisk = 0;
  }
  if (isNaN(this.diversificationScore)) {
    this.diversificationScore = 0;
  }
  
  // Validate allocations
  this.allocations = this.allocations.filter(allocation => {
    const isValid = !isNaN(allocation.shares) && 
                    !isNaN(allocation.investedAmount) && 
                    !isNaN(allocation.expectedReturn) &&
                    !isNaN(allocation.weight);
    
    if (!isValid) {
      console.warn(`Removing invalid allocation for ${allocation.symbol}`);
    }
    return isValid;
  });
  
  next();
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
