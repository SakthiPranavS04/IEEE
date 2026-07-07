import mongoose from 'mongoose';

const committeeSchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true }, title: String, description: String, chairs: [mongoose.Schema.Types.Mixed], members: [mongoose.Schema.Types.Mixed]
}, { timestamps: true });

const Committee = mongoose.model('Committee', committeeSchema);
export default Committee;