import mongoose from 'mongoose';
import Setting from './models/Setting.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultSettings = [
  {
    key: 'heroImages',
    value: ['/assets/kec_gate.jpg', '/assets/kec_itpark.jpg', '/assets/kec_admin.jpg'],
    description: 'Images for the home page hero carousel'
  },
  {
    key: 'aboutImage',
    value: '/assets/kec_gate.jpg',
    description: 'Image for the About Us section'
  },
  {
    key: 'ieee_about_image',
    value: '/assets/kec_gate.jpg',
    description: 'Image for the About Us section'
  },
  {
    key: 'keystonesVideoUrl',
    value: 'https://youtu.be/_90Hd1qMDGM',
    description: 'Video URL for the Keystones section'
  },
  {
    key: 'impactStats',
    value: [
      { id: 1, value: "45+", label: "Active Members" },
      { id: 2, value: "75+", label: "Technical Events Organized" },
      { id: 3, value: "18+", label: "National Awards" },
      { id: 4, value: "3+", label: "Research Publications" },
      { id: 5, value: "20+", label: "Workshops Conducted" },
      { id: 6, value: "10+", label: "Industry Collaborations" }
    ],
    description: 'Impact statistics shown on the home page'
  },
  {
    key: 'testimonials',
    value: [
      { id: 1, text: "IEEE helped me improve my leadership skills and technical confidence through hands-on event organization.", author: "Student Member", role: "KEC IEEE SB" },
      { id: 2, text: "The networking opportunities and workshops provided valuable industry exposure and practical knowledge.", author: "IEEE Alumni", role: "KEC IEEE SB" },
      { id: 3, text: "Being part of IEEE motivated me to explore research, innovation, and professional development beyond academics.", author: "IEEE Graduate", role: "KEC IEEE SB" }
    ],
    description: 'Testimonials from students and alumni'
  },
  {
    key: 'memberCount',
    value: '45',
    description: 'Total active members count'
  },
  {
    key: 'eventsCount',
    value: '75+',
    description: 'Total technical events count'
  },
  {
    key: 'awardsCount',
    value: '18+',
    description: 'Total national awards count'
  },
  {
    key: 'papersCount',
    value: '15',
    description: 'Total research papers count'
  },
  {
    key: 'mission',
    value: "To cultivate a culture of innovation, foster teamwork, and enhance student capability in research and design through seminars, hands-on workshops, student-led projects, and professional networking.",
    description: 'Mission statement'
  },
  {
    key: 'vision',
    value: "To build a world-class center of technical learning and professional excellence that empowers young minds to create engineering solutions for a sustainable and technologically advanced society.",
    description: 'Vision statement'
  }
];

const seedSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ieee_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    await Setting.deleteMany({ key: { $in: defaultSettings.map(s => s.key) } });
    await Setting.insertMany(defaultSettings);
    
    console.log(`Seeded ${defaultSettings.length} settings successfully!`);
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedSettings();
