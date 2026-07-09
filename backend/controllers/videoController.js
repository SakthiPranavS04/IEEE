import Video from '../models/Video.js';

export const getVideos = async (req, res) => {
  try { const items = await Video.find({}); res.json(items); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

export const createVideo = async (req, res) => {
  try { const item = new Video(req.body); const created = await item.save(); res.status(201).json(created); }
  catch (error) { res.status(400).json({ message: error.message }); }
};

export const updateVideo = async (req, res) => {
  try { const item = await Video.findOneAndUpdate({ _id: req.params.id }, req.body, {new:true});
    if (item) res.json(item); else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const deleteVideo = async (req, res) => {
  try { const item = await Video.findOneAndDelete({ _id: req.params.id });
    if (item) res.json({ message: 'Removed' }); else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};