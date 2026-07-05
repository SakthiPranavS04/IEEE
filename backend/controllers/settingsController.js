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
    res.status(201).json(createdSetting);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
