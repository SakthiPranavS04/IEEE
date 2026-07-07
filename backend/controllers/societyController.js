import Society from '../models/Society.js';

export const getSocietys = async (req, res) => {
  try { const items = await Society.find({}); res.json(items); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

export const createSociety = async (req, res) => {
  try { const item = new Society(req.body); const created = await item.save(); res.status(201).json(created); }
  catch (error) { res.status(400).json({ message: error.message }); }
};

export const updateSociety = async (req, res) => {
  try { const item = await Society.findOneAndUpdate({ id: req.params.id }, req.body, {new:true});
    if (item) res.json(item); else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const deleteSociety = async (req, res) => {
  try { const item = await Society.findOneAndDelete({ id: req.params.id });
    if (item) res.json({ message: 'Removed' }); else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};