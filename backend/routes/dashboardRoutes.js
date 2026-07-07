import express from 'express';
import { getDashboardStats, getDashboardData } from '../controllers/dashboardController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getDashboardData);
router.route('/stats').get(protect, getDashboardStats);

export default router;
