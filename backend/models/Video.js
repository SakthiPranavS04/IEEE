import mongoose from 'mongoose';

const videoSchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true }, url: String, category: String, description: String
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);
export default Video;