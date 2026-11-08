import Newsletter from '../models/Newsletter.js';

// @desc    Get all active newsletters
// @route   GET /api/newsletters
// @access  Public
export const getNewsletters = async (req, res) => {
  try {
    const { society } = req.query;
    const filter = { isActive: true };

    if (society && society !== 'All') {
      filter.society = { $regex: new RegExp(society, 'i') };
    }

    const newsletters = await Newsletter.find(filter).sort({ createdAt: -1 });
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get newsletter by ID
// @route   GET /api/newsletters/:id
// @access  Public
export const getNewsletterById = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }
    res.json(newsletter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new newsletter edition
// @route   POST /api/newsletters
// @access  Private/Admin
export const createNewsletter = async (req, res) => {
  try {
    const newsletter = new Newsletter(req.body);
    const createdNewsletter = await newsletter.save();
    res.status(201).json(createdNewsletter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a newsletter edition
// @route   PUT /api/newsletters/:id
// @access  Private/Admin
export const updateNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }
    res.json(newsletter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a newsletter edition
// @route   DELETE /api/newsletters/:id
// @access  Private/Admin
export const deleteNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }
    res.json({ message: 'Newsletter removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

