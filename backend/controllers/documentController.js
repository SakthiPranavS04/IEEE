import Document from '../models/Document.js';

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDocument = async (req, res) => {
  try {
    const item = new Document(req.body);
    const created = await item.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const item = await Document.findOneAndUpdate({ id: req.params.id }, req.body, {new:true});
    if (item) res.json(item); else res.status(404).json({ message: 'Not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const item = await Document.findOneAndDelete({ id: req.params.id });
    if (item) res.json({ message: 'Removed' }); else res.status(404).json({ message: 'Not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
