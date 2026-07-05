import Event from '../models/Event.js';
import TeamMember from '../models/TeamMember.js';
import ContactMessage from '../models/ContactMessage.js';
import JoinRegistration from '../models/JoinRegistration.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalTeamMembers = await TeamMember.countDocuments();
    const newContactMessages = await ContactMessage.countDocuments({ status: 'Pending' });
    const newJoinRequests = await JoinRegistration.countDocuments({ status: 'Pending' });

    const recentMessages = await ContactMessage.find().sort({ createdAt: -1 }).limit(5);
    const recentJoinRequests = await JoinRegistration.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: {
        totalEvents,
        totalTeamMembers,
        newContactMessages,
        newJoinRequests,
      },
      recentActivity: {
        recentMessages,
        recentJoinRequests,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
