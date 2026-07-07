import express from 'express';
import { getVideos, createVideo, updateVideo, deleteVideo } from '../controllers/videoController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getVideos).post(protect, createVideo);
router.route('/:id').put(protect, updateVideo).delete(protect, deleteVideo);

export default router;