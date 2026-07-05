import express from 'express';
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';

const router = express.Router();

router.route('/').get(getAnnouncements).post(createAnnouncement);
router.route('/:id').get(getAnnouncementById).put(updateAnnouncement).delete(deleteAnnouncement);

export default router;
