import Request from '../models/Request.js';

// @desc    Create a new request submission
// @route   POST /api/requests
// @access  Public
export const createRequest = async (req, res) => {
  try {
    console.log('1. Incoming req.body:', JSON.stringify(req.body).substring(0, 500) + '...');
    
    const { referenceNumber, form_slug, form_name, submitted_at, data } = req.body;

    if (!referenceNumber || !form_slug || !form_name || !data) {
      console.log('2. Validation errors: Missing required fields');
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const requestSubmission = new Request({
      referenceNumber,
      form_slug,
      form_name,
      submitted_at: submitted_at || new Date(),
      data,
    });

    const createdRequest = await requestSubmission.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    console.error('3. MongoDB errors / Server errors:', error);
    res.status(500).json({ message: 'Server error while processing request', error: error.message });
  }
};
