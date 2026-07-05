import TeamMember from '../models/TeamMember.js';

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
export const getTeamMembers = async (req, res) => {
  try {
    const team = await TeamMember.find({}).sort({ order: 1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get team member by ID
// @route   GET /api/team/:id
// @access  Public
export const getTeamMemberById = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (member) {
      res.json(member);
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a team member
// @route   POST /api/team
// @access  Private/Admin
export const createTeamMember = async (req, res) => {
  try {
    const { name, role, category, image, linkedin, github, order, isActive } = req.body;

    const member = new TeamMember({
      name,
      role,
      category,
      image,
      linkedin,
      github,
      order,
      isActive,
    });

    const createdMember = await member.save();
    res.status(201).json(createdMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private/Admin
export const updateTeamMember = async (req, res) => {
  try {
    const { name, role, category, image, linkedin, github, order, isActive } = req.body;

    const member = await TeamMember.findById(req.params.id);

    if (member) {
      member.name = name || member.name;
      member.role = role || member.role;
      member.category = category || member.category;
      member.image = image || member.image;
      member.linkedin = linkedin || member.linkedin;
      member.github = github || member.github;
      member.order = order !== undefined ? order : member.order;
      member.isActive = isActive !== undefined ? isActive : member.isActive;

      const updatedMember = await member.save();
      res.json(updatedMember);
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
export const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (member) {
      await member.deleteOne();
      res.json({ message: 'Team member removed' });
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
