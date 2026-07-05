import express from 'express';
import {
  getSponsors,
  getSponsorById,
  createSponsor,
  updateSponsor,
  deleteSponsor,
} from '../controllers/sponsorController.js';

const router = express.Router();

router.route('/').get(getSponsors).post(createSponsor);
router.route('/:id').get(getSponsorById).put(updateSponsor).delete(deleteSponsor);

export default router;
