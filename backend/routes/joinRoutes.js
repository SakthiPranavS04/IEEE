import express from 'express';
import {
  getRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistration,
  deleteRegistration,
} from '../controllers/joinController.js';

const router = express.Router();

router.route('/').get(getRegistrations).post(createRegistration);
router.route('/:id').get(getRegistrationById).put(updateRegistration).delete(deleteRegistration);

export default router;
