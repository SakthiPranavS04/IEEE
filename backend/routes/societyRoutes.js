import express from 'express';
import { getSocietys, createSociety, updateSociety, deleteSociety } from '../controllers/societyController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getSocietys).post(protect, createSociety);
router.route('/:id').put(protect, updateSociety).delete(protect, deleteSociety);

export default router;