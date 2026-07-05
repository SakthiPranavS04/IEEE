import mongoose from 'mongoose';
import Announcement from './models/Announcement.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultNews = [
  {
    title: "IEEE Student Branch KEC wins Best Branch Laurels",
    category: "Award",
    source: "Erode Daily",
    date: new Date("Oct 14, 2025"),
    content: "Kongu Engineering College student branch recognized under Madras Section for outstanding technical contributions and volunteering.",
    color: "#8b5cf6",
    isPublished: true,
    isActive: true
  },
  {
    title: "Students showcase Smart Assistive Device at State Expo",
    category: "Exhibition",
    source: "Tech Journal",
    date: new Date("Nov 02, 2025"),
    content: "Sponsored by IEEE SPS and KEC SRC, a student team built a voice-assisted glove prototype for quadriplegic rehabilitation.",
    color: "#06b6d4",
    isPublished: true,
    isActive: true
  },
  {
    title: "National Hackathon on Green Energy hosted by KEC IEEE SB",
    category: "Hackathon",
    source: "The Campus News",
    date: new Date("Jan 18, 2026"),
    content: "More than 50 teams from across Southern India participated to pitch solar tracking and smart grid distribution prototypes.",
    color: "#10b981",
    isPublished: true,
    isActive: true
  }
];

const seedAnnouncements = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ieee_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    await Announcement.deleteMany({});
    await Announcement.insertMany(defaultNews);
    
    console.log(`Seeded ${defaultNews.length} announcements successfully!`);
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedAnnouncements();
