import mongoose from 'mongoose';

const achievementSchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true }, category: String, desc: String, iconType: String
}, { timestamps: true });

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;