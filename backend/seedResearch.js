import mongoose from 'mongoose';
import ResearchPaper from './models/ResearchPaper.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultResearchPapers = [
  {
    title: "Smart Assistive Glove for Quadriplegic Patients using IoT",
    authors: "Abhishek M., Sneha R.",
    category: "IEEE",
    desc: "A voice-controlled assistive glove prototype using IoT sensors and machine learning for rehabilitation.",
    year: "2026",
    fileUrl: "paper_001.pdf"
  },
  {
    title: "Edge Computing for Real-Time ECG Processing",
    authors: "Karthik Raja, Harish K.",
    category: "IEEE",
    desc: "Implementation of digital signal processing algorithms on microcontrollers for cardiac monitoring.",
    year: "2025",
    fileUrl: "paper_002.pdf"
  },
  {
    title: "GreenTech Solutions for Sustainable Agriculture Automation",
    authors: "Dharini P., Naveen S.",
    category: "Conference",
    desc: "Solar-powered smart irrigation system with AI-based crop monitoring.",
    year: "2025",
    fileUrl: "paper_003.pdf"
  }
];

const seedResearch = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ieee_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    await ResearchPaper.deleteMany({});
    await ResearchPaper.insertMany(defaultResearchPapers);
    
    console.log(`Seeded ${defaultResearchPapers.length} research papers successfully!`);
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedResearch();
