import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ MongoDB Connection Error: MONGO_URI is not set in backend/.env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Troubleshooting tips:');
    console.error('1. Check if your current IP is whitelisted in MongoDB Atlas (Network Access -> Add IP -> 0.0.0.0/0 for development).');
    console.error('2. Verify the username and password in MONGO_URI (ensure special characters in passwords like "@" are URL-encoded as "%40").');
    console.error('3. Verify that your cluster is active and not paused.');
    process.exit(1);
  }
};

export default connectDB;
