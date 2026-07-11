import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Setting from './models/Setting.js';

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    const setting = await Setting.findOne({ key: 'ieee_execomm_societies_v3' });
    if (setting) {
      console.log('Value starts with:', setting.value.substring(0, 100));
      if (setting.value.includes('TEST1')) {
        console.log('TEST1 IS IN THE DB');
      } else {
        console.log('TEST1 IS NOT IN THE DB');
      }
    } else {
      console.log('Setting not found in DB');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
};

run();
