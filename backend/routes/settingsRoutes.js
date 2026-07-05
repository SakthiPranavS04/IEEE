import express from 'express';
import {
  getSettings,
  getSettingByKey,
  createSetting,
  updateSetting,
  deleteSetting,
} from '../controllers/settingsController.js';

const router = express.Router();

router.route('/').get(getSettings).post(createSetting);
router.route('/:key').get(getSettingByKey).put(updateSetting).delete(deleteSetting);

export default router;
