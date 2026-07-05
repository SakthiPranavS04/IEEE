import JoinRegistration from '../models/JoinRegistration.js';

// @desc    Get all join registrations
// @route   GET /api/join
// @access  Private/Admin
export const getRegistrations = async (req, res) => {
  try {
    const registrations = await JoinRegistration.find({}).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get registration by ID
// @route   GET /api/join/:id
// @access  Private/Admin
export const getRegistrationById = async (req, res) => {
  try {
    const registration = await JoinRegistration.findById(req.params.id);
    if (registration) {
      res.json(registration);
    } else {
      res.status(404).json({ message: 'Registration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a join registration
// @route   POST /api/join
// @access  Public
export const createRegistration = async (req, res) => {
  try {
    const { name, email, phone, college, department, year, membershipType, resume, portfolio, github, linkedin } = req.body;

    const registration = new JoinRegistration({
      name,
      email,
      phone,
      college,
      department,
      year,
      membershipType,
      resume,
      portfolio,
      github,
      linkedin,
    });

    const createdRegistration = await registration.save();
    res.status(201).json(createdRegistration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update registration status
// @route   PUT /api/join/:id
// @access  Private/Admin
export const updateRegistration = async (req, res) => {
  try {
    const registration = await JoinRegistration.findById(req.params.id);

    if (registration) {
      registration.status = req.body.status || registration.status;

      const updatedRegistration = await registration.save();
      res.json(updatedRegistration);
    } else {
      res.status(404).json({ message: 'Registration not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete registration
// @route   DELETE /api/join/:id
// @access  Private/Admin
export const deleteRegistration = async (req, res) => {
  try {
    const registration = await JoinRegistration.findById(req.params.id);

    if (registration) {
      await registration.deleteOne();
      res.json({ message: 'Registration removed' });
    } else {
      res.status(404).json({ message: 'Registration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
