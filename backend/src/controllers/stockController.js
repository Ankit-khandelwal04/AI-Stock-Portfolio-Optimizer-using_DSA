import Stock from '../models/Stock.js';
import { getOrCreateStock, getMultipleStocks } from '../utils/apiHelper.js';

/**
 * @desc    Get all stocks
 * @route   GET /api/stocks
 * @access  Public
 */
export const getAllStocks = async (req, res) => {
  try {
    const { sector, minPrice, maxPrice, limit = 50 } = req.query;

    // Build query
    const query = {};
    if (sector) query.sector = sector;
    if (minPrice) query.price = { ...query.price, $gte: parseFloat(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };

    const stocks = await Stock.find(query)
      .limit(parseInt(limit))
      .sort({ symbol: 1 });

    res.json({
      count: stocks.length,
      stocks: stocks,
    });
  } catch (error) {
    console.error('Get all stocks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get single stock by symbol
 * @route   GET /api/stocks/:symbol
 * @access  Public
 */
export const getStockBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;

    const stock = await getOrCreateStock(symbol);

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    res.json(stock);
  } catch (error) {
    console.error('Get stock error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * @desc    Search stocks by name or symbol
 * @route   GET /api/stocks/search/:query
 * @access  Public
 */
export const searchStocks = async (req, res) => {
  try {
    const { query } = req.params;

    const stocks = await Stock.find({
      $or: [
        { symbol: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
      ],
    }).limit(20);

    res.json({
      count: stocks.length,
      stocks: stocks,
    });
  } catch (error) {
    console.error('Search stocks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get stocks by multiple symbols
 * @route   POST /api/stocks/batch
 * @access  Public
 */
export const getStocksBatch = async (req, res) => {
  try {
    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ message: 'Please provide an array of symbols' });
    }

    const stocks = await getMultipleStocks(symbols);

    res.json({
      count: stocks.length,
      stocks: stocks,
    });
  } catch (error) {
    console.error('Get stocks batch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get available sectors
 * @route   GET /api/stocks/sectors/list
 * @access  Public
 */
export const getSectors = async (req, res) => {
  try {
    const sectors = await Stock.distinct('sector');
    
    res.json({
      count: sectors.length,
      sectors: sectors.filter((s) => s && s !== 'Unknown'),
    });
  } catch (error) {
    console.error('Get sectors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
