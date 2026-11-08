import express from 'express';
import {
  getNewsletters,
  getNewsletterById,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
} from '../controllers/newsletterPublicationController.js';

const router = express.Router();

router.route('/')
  .get(getNewsletters)
  .post(createNewsletter);

router.route('/:id')
  .get(getNewsletterById)
  .put(updateNewsletter)
  .delete(deleteNewsletter);

export default router;

