import express from 'express';
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';

const router = express.Router();

router.route('/').get(getTeamMembers).post(createTeamMember);
router.route('/:id').get(getTeamMemberById).put(updateTeamMember).delete(deleteTeamMember);

export default router;
