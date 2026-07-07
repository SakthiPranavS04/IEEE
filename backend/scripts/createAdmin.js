import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ieee', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: 'admin@gmail.com' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Using insertOne / direct create bypassing save middleware to guarantee hash, 
    // but Admin model has pre('save') that hashes passwords. 
    // Let's just create it. The model will hash it automatically.
    
    const admin = new Admin({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin created successfully');
    process.exit(0);

  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
