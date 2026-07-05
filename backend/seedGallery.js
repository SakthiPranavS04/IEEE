import mongoose from 'mongoose';
import Gallery from './models/Gallery.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultGallery = [
  {
    title: "Sports & Athletics",
    category: "Campus Life",
    description: "State-level facilities",
    images: ["https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=max"]
  },
  {
    title: "Cultural Events",
    category: "Events",
    description: "Annual tech fest & symposiums",
    images: ["https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=max"]
  },
  {
    title: "Learning Spaces",
    category: "Academic",
    description: "24/7 library access",
    images: ["https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=max"]
  },
  {
    title: "Student Clubs",
    category: "Engagement",
    description: "50+ active clubs",
    images: ["https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=max"]
  },
  {
    title: "World-Class Hostel Facilities",
    category: "Living",
    description: "Separate hostels for boys & girls with modern amenities, Wi-Fi, and 24/7 security",
    images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=max"]
  },
  {
    title: "Transport Facilities",
    category: "Services",
    description: "Extensive bus network for easy commute",
    images: ["https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=800&auto=format&fit=max"]
  },
  {
    title: "Smart Auditoriums",
    category: "Infrastructure",
    description: "Air-conditioned seminar halls with advanced AV systems",
    images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=max"]
  },
  {
    title: "Research Labs",
    category: "Innovation",
    description: "Advanced centers for computing and hardware testing",
    images: ["https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=max"]
  },
  {
    title: "Green Campus",
    category: "Environment",
    description: "Solar energy grids and eco-friendly spaces",
    images: ["https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800&auto=format&fit=max"]
  },
  {
    title: "Main Campus Gateway",
    category: "KEC",
    description: "Welcome to Kongu Engineering College autonomous campus",
    images: ["https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=max"]
  }
];

const seedGallery = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ieee_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    await Gallery.deleteMany({});
    await Gallery.insertMany(defaultGallery);
    
    console.log(`Seeded ${defaultGallery.length} gallery items successfully!`);
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedGallery();
