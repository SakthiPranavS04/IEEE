const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const gallerySchema = mongoose.Schema({
  title: String,
  description: String,
  category: String,
  images: [String]
});

const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    const items = await Gallery.find({}, 'title description category').sort({ createdAt: -1 });
    console.log(`Found ${items.length} items`);
    console.log(items);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectDB();
