import Achievement from '../models/Achievement.js';

export const getAchievements = async (req, res) => {
  try { const items = await Achievement.find({}); res.json(items); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

export const createAchievement = async (req, res) => {
  try { const item = new Achievement(req.body); const created = await item.save(); res.status(201).json(created); }
  catch (error) { res.status(400).json({ message: error.message }); }
};

export const updateAchievement = async (req, res) => {
  try { const item = await Achievement.findOneAndUpdate({ id: req.params.id }, req.body, {new:true});
    if (item) res.json(item); else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const deleteAchievement = async (req, res) => {
  try { const item = await Achievement.findOneAndDelete({ id: req.params.id });
    if (item) res.json({ message: 'Removed' }); else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};