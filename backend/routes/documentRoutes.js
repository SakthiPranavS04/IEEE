import express from 'express';
import { getDocuments } from '../controllers/documentController.js';

const router = express.Router();

router.route('/').get(getDocuments);

export default router;
