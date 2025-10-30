import Portfolio from '../models/Portfolio.js';
import Stock from '../models/Stock.js';
import User from '../models/User.js';
import { optimizePortfolio } from '../utils/optimizer.js';

/**
 * @desc    Optimize and create a new portfolio
 * @route   POST /api/portfolio/optimize
 * @access  Private
 */
export const optimizeAndCreatePortfolio = async (req, res) => {
  try {
    const { name, totalBudget, riskLevel, stockSymbols, algorithm } = req.body;

    // Validation
    if (!totalBudget || totalBudget <= 0) {
      return res.status(400).json({ message: 'Please provide a valid budget' });
    }

    if (!riskLevel || !['low', 'medium', 'high'].includes(riskLevel)) {
      return res.status(400).json({ message: 'Please provide a valid risk level (low, medium, high)' });
    }

    // Get stocks to consider
    let stocks;
    if (stockSymbols && Array.isArray(stockSymbols) && stockSymbols.length > 0) {
      // Use specific stocks
      stocks = await Stock.find({ symbol: { $in: stockSymbols.map(s => s.toUpperCase()) } });
    } else {
      // Use all available stocks
      stocks = await Stock.find({});
    }

    if (stocks.length === 0) {
      return res.status(400).json({ message: 'No stocks available for optimization' });
    }

    // Run optimization algorithm
    console.log(`Optimizing portfolio with ${stocks.length} stocks, budget: $${totalBudget}, risk: ${riskLevel}`);
    const optimizationResult = optimizePortfolio(
      stocks,
      totalBudget,
      riskLevel,
      algorithm || 'greedy'
    );
    console.log(`Optimization complete: ${optimizationResult.allocations.length} stocks selected, used: $${optimizationResult.usedBudget}`);

    // Create portfolio
    const portfolio = await Portfolio.create({
      user: req.user._id,
      name: name || 'My Portfolio',
      totalBudget: totalBudget,
      riskLevel: riskLevel,
      allocations: optimizationResult.allocations,
      totalExpectedReturn: optimizationResult.totalExpectedReturn,
      totalRisk: optimizationResult.totalRisk,
      diversificationScore: optimizationResult.diversificationScore,
    });

    // Add portfolio to user's portfolios
    await User.findByIdAndUpdate(req.user._id, {
      $push: { portfolios: portfolio._id },
    });

    // Populate stock details
    const populatedPortfolio = await Portfolio.findById(portfolio._id).populate(
      'allocations.stock'
    );

    res.status(201).json({
      portfolio: populatedPortfolio,
      optimization: {
        usedBudget: optimizationResult.usedBudget,
        remainingBudget: optimizationResult.remainingBudget,
        algorithm: algorithm || 'greedy',
      },
    });
  } catch (error) {
    console.error('Optimize portfolio error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * @desc    Get all portfolios for logged-in user
 * @route   GET /api/portfolio
 * @access  Private
 */
export const getUserPortfolios = async (req, res) => {
  try {
    const { status } = req.query;

    const query = { user: req.user._id };
    if (status) query.status = status;

    const portfolios = await Portfolio.find(query)
      .populate('allocations.stock')
      .sort({ createdAt: -1 });

    res.json({
      count: portfolios.length,
      portfolios: portfolios,
    });
  } catch (error) {
    console.error('Get portfolios error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get single portfolio by ID
 * @route   GET /api/portfolio/:id
 * @access  Private
 */
export const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id).populate('allocations.stock');

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Check if portfolio belongs to user
    if (portfolio.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this portfolio' });
    }

    res.json(portfolio);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update portfolio
 * @route   PUT /api/portfolio/:id
 * @access  Private
 */
export const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Check if portfolio belongs to user
    if (portfolio.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this portfolio' });
    }

    // Update allowed fields
    portfolio.name = req.body.name || portfolio.name;
    portfolio.status = req.body.status || portfolio.status;

    const updatedPortfolio = await portfolio.save();
    const populatedPortfolio = await Portfolio.findById(updatedPortfolio._id).populate(
      'allocations.stock'
    );

    res.json(populatedPortfolio);
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete portfolio
 * @route   DELETE /api/portfolio/:id
 * @access  Private
 */
export const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Check if portfolio belongs to user
    if (portfolio.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this portfolio' });
    }

    await Portfolio.findByIdAndDelete(req.params.id);

    // Remove from user's portfolios
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { portfolios: req.params.id },
    });

    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get portfolio statistics
 * @route   GET /api/portfolio/:id/stats
 * @access  Private
 */
export const getPortfolioStats = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id).populate('allocations.stock');

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Check if portfolio belongs to user
    if (portfolio.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this portfolio' });
    }

    // Calculate sector distribution
    const sectorDistribution = {};
    portfolio.allocations.forEach((allocation) => {
      if (allocation.stock && allocation.stock.sector) {
        const sector = allocation.stock.sector;
        sectorDistribution[sector] = (sectorDistribution[sector] || 0) + allocation.weight;
      }
    });

    // Calculate statistics
    const stats = {
      totalStocks: portfolio.allocations.length,
      totalInvested: portfolio.allocations.reduce((sum, a) => sum + a.investedAmount, 0),
      averageExpectedReturn: portfolio.totalExpectedReturn,
      riskScore: portfolio.totalRisk,
      diversificationScore: portfolio.diversificationScore,
      sectorDistribution: sectorDistribution,
      topHoldings: portfolio.allocations
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 5)
        .map((a) => ({
          symbol: a.symbol,
          name: a.name,
          weight: a.weight,
          investedAmount: a.investedAmount,
        })),
    };

    res.json(stats);
  } catch (error) {
    console.error('Get portfolio stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
