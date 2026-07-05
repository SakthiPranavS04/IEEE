import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

router.route('/stats').get(getDashboardStats);

export default router;
