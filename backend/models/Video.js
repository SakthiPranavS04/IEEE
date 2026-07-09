import mongoose from 'mongoose';

const videoSchema = mongoose.Schema({
  title: { type: String, required: true }, url: String, category: String, description: String
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);
export default Video;