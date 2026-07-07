import FormTemplate from '../models/FormTemplate.js';

export const getFormTemplates = async (req, res) => {
  try { const items = await FormTemplate.find({}); res.json(items); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

export const createFormTemplate = async (req, res) => {
  try { const item = new FormTemplate(req.body); const created = await item.save(); res.status(201).json(created); }
  catch (error) { res.status(400).json({ message: error.message }); }
};

export const updateFormTemplate = async (req, res) => {
  try { const item = await FormTemplate.findOneAndUpdate({ id: req.params.id }, req.body, {new:true});
    if (item) res.json(item); else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const deleteFormTemplate = async (req, res) => {
  try { const item = await FormTemplate.findOneAndDelete({ id: req.params.id });
    if (item) res.json({ message: 'Removed' }); else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};