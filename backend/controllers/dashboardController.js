import Event from '../models/Event.js';
import TeamMember from '../models/TeamMember.js';
import ContactMessage from '../models/ContactMessage.js';
import JoinRegistration from '../models/JoinRegistration.js';
import Gallery from '../models/Gallery.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import Feedback from '../models/Feedback.js';
import Video from '../models/Video.js';
import Document from '../models/Document.js';
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
// @desc    Get complete dashboard data
// @route   GET /api/dashboard
// @access  Private/Admin
export const getDashboardData = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalTeamMembers = await TeamMember.countDocuments();
    const totalGalleryFolders = await Gallery.countDocuments();
    
    // Sum up all images inside galleries
    const galleries = await Gallery.find({});
    const totalGalleryImages = galleries.reduce((acc, folder) => acc + (folder.images ? folder.images.length : 0), 0);
    
    const totalVideos = await Video.countDocuments();
    const totalDocuments = await Document.countDocuments();
    
    const totalContacts = await ContactMessage.countDocuments();
    const totalJoinRequests = await JoinRegistration.countDocuments();
    const totalSubscribers = await NewsletterSubscriber.countDocuments();
    const totalFeedbacks = await Feedback.countDocuments();

    res.json({
      totalEvents,
      totalTeamMembers,
      totalGalleryFolders,
      totalGalleryImages,
      totalVideos,
      totalDocuments,
      totalContacts,
      totalJoinRequests,
      totalSubscribers,
      totalFeedbacks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
