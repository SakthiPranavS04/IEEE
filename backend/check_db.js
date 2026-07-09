import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gallery from './models/Gallery.js';

dotenv.config();

const checkDb = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const items = await Gallery.find({});
    console.log("Gallery Items in DB:", items.length);
    console.log(items);
    process.exit();
};

checkDb();
