import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const admins = [
  {
    name: 'Sakthi Pranav',
    email: 'sakthipranavs.24cse@kongu.edu',
    password: '123456',
    role: 'superadmin'
  },
  {
    name: 'IEEE Admin',
    email: 'ieee@kongu.edu',
    password: 'admin123',
    role: 'admin'
  }
];

const seedAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ieee_db');
    console.log('MongoDB connected');

    await Admin.deleteMany({});
    
    // We must create them individually so that the pre-save hook for password hashing runs
    for (const adminData of admins) {
      await Admin.create(adminData);
    }

    console.log('Admins seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmins();
