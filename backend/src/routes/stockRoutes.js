import express from 'express';
import {
  getAllStocks,
  getStockBySymbol,
  searchStocks,
  getStocksBatch,
  getSectors,
} from '../controllers/stockController.js';

const router = express.Router();

// Public routes
router.get('/', getAllStocks);
router.get('/sectors/list', getSectors);
router.get('/search/:query', searchStocks);
router.post('/batch', getStocksBatch);
router.get('/:symbol', getStockBySymbol);

export default router;
