import express from 'express';
import {
  getContactMessages,
  getContactMessageById,
  createContactMessage,
  updateContactMessage,
  deleteContactMessage,
} from '../controllers/contactController.js';

const router = express.Router();

router.route('/').get(getContactMessages).post(createContactMessage);
router.route('/:id').get(getContactMessageById).put(updateContactMessage).delete(deleteContactMessage);

export default router;
