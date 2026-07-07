import mongoose from 'mongoose';

const newsitemSchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true }, content: String, date: String, category: String, image: String
}, { timestamps: true });

const NewsItem = mongoose.model('NewsItem', newsitemSchema);
export default NewsItem;