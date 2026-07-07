import express from 'express';
import { getFormTemplates, createFormTemplate, updateFormTemplate, deleteFormTemplate } from '../controllers/formtemplateController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getFormTemplates).post(protect, createFormTemplate);
router.route('/:id').put(protect, updateFormTemplate).delete(protect, deleteFormTemplate);

export default router;