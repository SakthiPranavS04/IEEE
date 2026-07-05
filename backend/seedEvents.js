import mongoose from 'mongoose';
import Event from './models/Event.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultPast = [
  {
    title: "Workshop on Digital Signal Processing & IoT",
    desc: "A 3-day practical bootcamp focusing on capturing and processing real-time sensor waveforms using ESP32 and DSP filtering algorithms.",
    date: "May 18, 2026",
    venue: "DSP Lab, ECE Dept, KEC",
    tag: "SPS Chapter",
    highlights: "50+ participants built smart ECG filter prototypes.",
    isHighlighted: true,
    highlightOrder: 1,
    highlightDescription: "A 3-day practical bootcamp focusing on capturing and processing real-time sensor waveforms using ESP32 and DSP filtering algorithms. 50+ participants built smart ECG filter prototypes.",
    highlightImage: null,
    highlightTheme: "Purple"
  },
  {
    title: "WIE CodeQuest: Coding Bootcamp for Girls",
    desc: "A bootcamp dedicated to teaching web building, database structure, and frontend hosting to young female engineers.",
    date: "April 24, 2026",
    venue: "Internet Lab, KEC",
    tag: "WIE Group",
    highlights: "Participated by 80 girls, 5 projects were selected for incubation support.",
    isHighlighted: true,
    highlightOrder: 2,
    highlightDescription: "A bootcamp dedicated to teaching web building, database structure, and frontend hosting to young female engineers. Participated by 80 girls, 5 projects were selected for incubation support.",
    highlightImage: null,
    highlightTheme: "Cyan"
  },
  {
    title: "National Conference on Computing & Communication (NCCC 2026)",
    desc: "Flagship paper presentation event featuring research papers from student groups across the region, judged by Anna University faculty.",
    date: "March 15, 2026",
    venue: "Maharaja Auditorium, KEC",
    tag: "Conference",
    highlights: "30+ research papers published in local IEEE digital archives.",
    isHighlighted: true,
    highlightOrder: 3,
    highlightDescription: "Flagship paper presentation event featuring research papers from student groups across the region, judged by Anna University faculty. 30+ research papers published in local IEEE digital archives.",
    highlightImage: null,
    highlightTheme: "IEEE Blue"
  },
  {
    title: "Guest Lecture: Opportunities in Edge AI & TinyML",
    desc: "A seminar on running micro neural-network models directly on resource-constrained microcontrollers.",
    date: "February 12, 2026",
    venue: "Mechanical Dept Seminar Hall, KEC",
    tag: "Guest Lecture",
    highlights: "Delivered by senior R&D engineer from Intel India.",
    isHighlighted: false,
    highlightOrder: 4,
    highlightDescription: "A seminar on running micro neural-network models directly on resource-constrained microcontrollers. Delivered by senior R&D engineer from Intel India.",
    highlightImage: null,
    highlightTheme: "Green"
  }
];

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ieee_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    await Event.deleteMany({});
    await Event.insertMany(defaultPast);
    
    console.log(`Seeded ${defaultPast.length} events successfully!`);
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedEvents();
