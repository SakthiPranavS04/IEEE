import express from 'express';
import {
  getSubscribers,
  getSubscriberById,
  subscribeNewsletter,
  updateSubscriberStatus,
  deleteSubscriber,
} from '../controllers/newsletterController.js';

const router = express.Router();

router.route('/').get(getSubscribers).post(subscribeNewsletter);
router.route('/:id').get(getSubscriberById).put(updateSubscriberStatus).delete(deleteSubscriber);

export default router;
