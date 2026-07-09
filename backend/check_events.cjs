const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const eventSchema = mongoose.Schema({
  title: String,
  date: String, // or Date
  location: String,
  type: String,
  status: String,
  category: String
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    const items = await Event.find({}, 'title date status category type').sort({ date: -1 });
    console.log(`Found ${items.length} events`);
    console.log(items);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectDB();
