import express from 'express';
import { getCommittees, createCommittee, updateCommittee, deleteCommittee } from '../controllers/committeeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCommittees).post(protect, createCommittee);
router.route('/:id').put(protect, updateCommittee).delete(protect, deleteCommittee);

export default router;