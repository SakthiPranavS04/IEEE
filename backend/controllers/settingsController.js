import Setting from '../models/Setting.js';

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find({});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get setting by key
// @route   GET /api/settings/:key
// @access  Public
export const getSettingByKey = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (setting) {
      res.json(setting);
    } else {
      res.status(404).json({ message: 'Setting not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a setting
// @route   POST /api/settings
// @access  Private/Admin
export const createSetting = async (req, res) => {
  try {
    const { key, value, description } = req.body;
    
    const settingExists = await Setting.findOne({ key });
    if (settingExists) {
      return res.status(400).json({ message: 'Setting with this key already exists' });
    }

    const setting = new Setting({
      key,
      value,
      description,
    });

    const createdSetting = await setting.save();
    
    // Sync to real database collections if necessary
    if (key === 'ieee_execomm_societies_v3' || key === 'ieee_execomm_students_v3') {
      await syncTeamMembers(key, createdSetting.value);
    }

    res.status(201).json(createdSetting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import TeamMember from '../models/TeamMember.js';

// Helper to sync settings JSON to TeamMember collection
const syncTeamMembers = async (key, valueStr) => {
  try {
    const data = JSON.parse(valueStr);
    if (!Array.isArray(data)) return;

    if (key === 'ieee_execomm_societies_v3') {
      // Remove all existing faculties to recreate them
      await TeamMember.deleteMany({ type: 'Faculty' });
      const newMembers = [];
      data.forEach(soc => {
        if (soc.faculty1 && soc.faculty1.name) {
          newMembers.push({
            name: soc.faculty1.name,
            role: soc.faculty1.position || 'Member',
            category: soc.name,
            type: 'Faculty',
            image: soc.faculty1.image,
            linkedin: soc.faculty1.linkedin,
            email: soc.faculty1.email,
            phone: soc.faculty1.phone,
            order: 1
          });
        }
        if (soc.faculty2 && soc.faculty2.name) {
          newMembers.push({
            name: soc.faculty2.name,
            role: soc.faculty2.position || 'Member',
            category: soc.name,
            type: 'Faculty',
            image: soc.faculty2.image,
            linkedin: soc.faculty2.linkedin,
            email: soc.faculty2.email,
            phone: soc.faculty2.phone,
            order: 2
          });
        }
      });
      if (newMembers.length > 0) await TeamMember.insertMany(newMembers);
    } 
    else if (key === 'ieee_execomm_students_v3') {
      // Remove all existing students to recreate them
      await TeamMember.deleteMany({ type: 'Student' });
      const newMembers = data.filter(st => st && st.name).map((st, idx) => ({
        name: st.name,
        role: st.position || 'Member',
        category: st.society || 'IEEE KEC SB',
        type: 'Student',
        image: st.image,
        department: st.department,
        year: st.yearOfStudy,
        ieeeNumber: st.ieeeNumber,
        order: idx
      }));
      if (newMembers.length > 0) await TeamMember.insertMany(newMembers);
    }
  } catch(e) {
    console.error('Failed to sync to TeamMember DB:', e);
  }
};

// @desc    Update a setting
// @route   PUT /api/settings/:key
// @access  Private/Admin
export const updateSetting = async (req, res) => {
  try {
    const { value, description } = req.body;

    const setting = await Setting.findOne({ key: req.params.key });

    if (setting) {
      setting.value = value !== undefined ? value : setting.value;
      setting.description = description || setting.description;

      const updatedSetting = await setting.save();
      
      // Sync to real database collections if necessary
      if (req.params.key === 'ieee_execomm_societies_v3' || req.params.key === 'ieee_execomm_students_v3') {
        await syncTeamMembers(req.params.key, updatedSetting.value);
      }

      res.json(updatedSetting);
    } else {
      res.status(404).json({ message: 'Setting not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a setting
// @route   DELETE /api/settings/:key
// @access  Private/Admin
export const deleteSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });

    if (setting) {
      await setting.deleteOne();
      res.json({ message: 'Setting removed' });
    } else {
      res.status(404).json({ message: 'Setting not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
