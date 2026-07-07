import NewsItem from '../models/NewsItem.js';

export const getNewsItems = async (req, res) => {
  try { const items = await NewsItem.find({}); res.json(items); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

export const createNewsItem = async (req, res) => {
  try { const item = new NewsItem(req.body); const created = await item.save(); res.status(201).json(created); }
  catch (error) { res.status(400).json({ message: error.message }); }
};

export const updateNewsItem = async (req, res) => {
  try { const item = await NewsItem.findOneAndUpdate({ id: req.params.id }, req.body, {new:true});
    if (item) res.json(item); else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const deleteNewsItem = async (req, res) => {
  try { const item = await NewsItem.findOneAndDelete({ id: req.params.id });
    if (item) res.json({ message: 'Removed' }); else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};