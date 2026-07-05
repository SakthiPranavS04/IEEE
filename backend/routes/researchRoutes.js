import express from 'express';
import { getResearchPapers, createResearchPaper } from '../controllers/researchController.js';

const router = express.Router();

router.route('/').get(getResearchPapers).post(createResearchPaper);

export default router;
