import mongoose from 'mongoose';

const researchPaperSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    authors: { type: String, required: true },
    category: { type: String, required: true },
    desc: { type: String, required: true },
    year: { type: String, required: true },
    fileUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ResearchPaper = mongoose.model('ResearchPaper', researchPaperSchema);

export default ResearchPaper;
