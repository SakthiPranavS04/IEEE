import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Newsletter from './models/Newsletter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const defaultNewsletters = [
  {
    title: "KEC IEEE SB Horizon - Annual Newsletter",
    society: "KEC IEEE SB",
    volume: "Volume 8 • Issue 1",
    date: "January 2026",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=max",
    editorial: "A Year of Breakthroughs, Section Awards, and 40+ Flagship Technical Initiatives across Kongu Engineering College.",
    highlights: [
      "IEEE Madras Section Outstanding Branch Recognition",
      "Student Branch Executive Committee 2025-26 Inductions",
      "Decade Gala & Technical Outreach across rural schools",
      "Over 12 student research papers published in IEEE Xplore"
    ],
    pages: 28,
    editor: "Student Branch Editorial Board",
    fileUrl: "",
    isActive: true
  },
  {
    title: "ByteWave - Computer Society Newsletter",
    society: "IEEE Computer Society(CS)",
    volume: "Quarterly Bulletin • Issue 4",
    date: "October 2025",
    cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=max",
    editorial: "Exploring Artificial Intelligence, Open-Source Contributions, and Cloud-Native Innovations.",
    highlights: [
      "HackOverflow 2025 Grand Finale Winning Innovations",
      "Roadmap: Mastering Fullstack Web Development in 2026",
      "Interview with KEC Alumni working at Tier-1 Tech Giants",
      "Hands-on Guide: Docker, Kubernetes & CI/CD Pipelines"
    ],
    pages: 18,
    editor: "CS Society Web & Content Team",
    fileUrl: "",
    isActive: true
  },
  {
    title: "Empower - WIE Affinity Group Newsletter",
    society: "IEEE Women in Engineering",
    volume: "Annual Edition • Vol. 5",
    date: "December 2025",
    cover: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=max",
    editorial: "Fostering Women in Science, Technology, and Leadership through Mentorship and Peer Support.",
    highlights: [
      "Keynote Reflections: Women Tech Leaders in Semiconductor Design",
      "EmpowerHER Hackathon Winners and Prototype Demos",
      "Mentorship Circles for Junior Year Engineering Women",
      "Community Outreach: Digital Literacy in Rural Perundurai"
    ],
    pages: 22,
    editor: "WIE Student Coordinators",
    fileUrl: "",
    isActive: true
  },
  {
    title: "Spark & Waves - APS Chapter Technical Digest",
    society: "IEEE Antennas & Propagation Society",
    volume: "Technical Monograph • Issue 2",
    date: "November 2025",
    cover: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=max",
    editorial: "Frontiers in Microstrip Antennas, Microwave Circuit Design, and High-Frequency RF Simulation.",
    highlights: [
      "Sub-6 GHz 5G Dual-Band Patch Antenna Design Study",
      "Laboratory Testing on Vector Network Analyzer (VNA)",
      "Student Delegation at IEEE MAPCON Conference",
      "Upcoming RF Hardware Design Competition Announcement"
    ],
    pages: 16,
    editor: "APS Editorial Team",
    fileUrl: "",
    isActive: true
  },
  {
    title: "RoboPulse - RAS & PES Joint Engineering Bulletin",
    society: "IEEE Robotics & Automation Society",
    volume: "Hardware Special • Issue 3",
    date: "August 2025",
    cover: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=max",
    editorial: "Robotics, Embedded Systems, and Clean Energy Storage Innovations by KEC Student Innovators.",
    highlights: [
      "ROS2 Autonomous Mobile Robot Navigation Case Study",
      "Solar Energy Maximum Power Point Tracking (MPPT) Systems",
      "RoboClash Battlebot Tournament Championship Highlights",
      "EV Battery Thermal Management Hardware Prototype"
    ],
    pages: 20,
    editor: "RAS & PES Technical Committee",
    fileUrl: "",
    isActive: true
  },
  {
    title: "SignalLine - ComSoc Student Chapter Edition",
    society: "IEEE Communications Society",
    volume: "Telecom Review • Issue 1",
    date: "September 2025",
    cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=max",
    editorial: "Broadband, Optical Fiber Communication, and Software Defined Radio Protocols.",
    highlights: [
      "Satellite Telemetry & Ground Station Tracking in KEC",
      "Introduction to GNU Radio and Software Defined Receivers",
      "Optical Time-Domain Reflectometer (OTDR) Workshop",
      "Next Frontiers in 6G and Terahertz Communications"
    ],
    pages: 14,
    editor: "ComSoc Publication Desk",
    fileUrl: "",
    isActive: true
  }
];

const seedNewsletters = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding newsletters');

    await Newsletter.deleteMany({});
    const inserted = await Newsletter.insertMany(defaultNewsletters);
    
    console.log(`✅ Seeded ${inserted.length} newsletters successfully into database!`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding newsletters:', err.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedNewsletters();

