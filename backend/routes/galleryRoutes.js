import express from 'express';
import {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';

const router = express.Router();

router.route('/').get(getGalleryItems).post(createGalleryItem);
router.route('/:id').get(getGalleryItemById).put(updateGalleryItem).delete(deleteGalleryItem);

export default router;
