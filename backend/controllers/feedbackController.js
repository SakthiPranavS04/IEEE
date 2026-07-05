import Feedback from '../models/Feedback.js';

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private/Admin
export const getFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find({}).sort({ createdAt: -1 });
    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get feedback by ID
// @route   GET /api/feedback/:id
// @access  Private/Admin
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (feedback) {
      res.json(feedback);
    } else {
      res.status(404).json({ message: 'Feedback not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Public
export const createFeedback = async (req, res) => {
  try {
    const { name, email, rating, feedback } = req.body;

    const newFeedback = new Feedback({
      name,
      email,
      rating,
      feedback,
    });

    const createdFeedback = await newFeedback.save();
    res.status(201).json(createdFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (feedback) {
      await feedback.deleteOne();
      res.json({ message: 'Feedback removed' });
    } else {
      res.status(404).json({ message: 'Feedback not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
