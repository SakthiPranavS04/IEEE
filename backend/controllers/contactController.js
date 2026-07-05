import ContactMessage from '../models/ContactMessage.js';

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private/Admin
export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get contact message by ID
// @route   GET /api/contacts/:id
// @access  Private/Admin
export const getContactMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (message) {
      res.json(message);
    } else {
      res.status(404).json({ message: 'Contact message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a contact message
// @route   POST /api/contacts
// @access  Public
export const createContactMessage = async (req, res) => {
  try {
    const { fullName, email, phone, college, department, message, ipAddress, browser, operatingSystem, country } = req.body;

    const newMessage = new ContactMessage({
      fullName,
      email,
      phone,
      college,
      department,
      message,
      ipAddress,
      browser,
      operatingSystem,
      country,
    });

    const createdMessage = await newMessage.save();
    res.status(201).json(createdMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update contact message status
// @route   PUT /api/contacts/:id
// @access  Private/Admin
export const updateContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (message) {
      message.status = req.body.status || message.status;

      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Contact message not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (message) {
      await message.deleteOne();
      res.json({ message: 'Contact message removed' });
    } else {
      res.status(404).json({ message: 'Contact message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
