import Document from '../models/Document.js';

// @desc    Fetch all documents
// @route   GET /api/documents
// @access  Public
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({});
    res.json(documents);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

export { getDocuments };
