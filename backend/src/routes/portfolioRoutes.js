import express from 'express';
import {
  optimizeAndCreatePortfolio,
  getUserPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  getPortfolioStats,
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.post('/optimize', protect, optimizeAndCreatePortfolio);
router.get('/', protect, getUserPortfolios);
router.get('/:id', protect, getPortfolioById);
router.put('/:id', protect, updatePortfolio);
router.delete('/:id', protect, deletePortfolio);
router.get('/:id/stats', protect, getPortfolioStats);

export default router;
