import express from 'express';
import {
  getFeedback,
  getFeedbackById,
  createFeedback,
  deleteFeedback,
} from '../controllers/feedbackController.js';

const router = express.Router();

router.route('/').get(getFeedback).post(createFeedback);
router.route('/:id').get(getFeedbackById).delete(deleteFeedback);

export default router;
