import ResearchPaper from '../models/ResearchPaper.js';

export const getResearchPapers = async (req, res) => {
  try {
    const papers = await ResearchPaper.find({});
    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createResearchPaper = async (req, res) => {
  try {
    const paper = new ResearchPaper(req.body);
    const createdPaper = await paper.save();
    res.status(201).json(createdPaper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
