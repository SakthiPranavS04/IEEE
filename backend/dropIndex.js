import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    await mongoose.connection.collection('videos').dropIndex('id_1');
    console.log('Successfully dropped the id_1 index from videos collection.');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
};

run();
