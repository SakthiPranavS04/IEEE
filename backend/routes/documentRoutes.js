import express from 'express';
import { getDocuments, createDocument, updateDocument, deleteDocument } from '../controllers/documentController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getDocuments).post(protect, createDocument);
router.route('/:id').put(protect, updateDocument).delete(protect, deleteDocument);

export default router;
