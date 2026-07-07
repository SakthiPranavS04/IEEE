import express from 'express';
import { getNewsItems, createNewsItem, updateNewsItem, deleteNewsItem } from '../controllers/newsitemController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getNewsItems).post(protect, createNewsItem);
router.route('/:id').put(protect, updateNewsItem).delete(protect, deleteNewsItem);

export default router;