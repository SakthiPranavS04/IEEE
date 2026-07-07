import express from 'express';
import { createRequest } from '../controllers/requestController.js';

const router = express.Router();

router.route('/').post(createRequest);

export default router;
