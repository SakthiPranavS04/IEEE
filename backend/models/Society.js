import mongoose from 'mongoose';

const societySchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true }, faculty1: mongoose.Schema.Types.Mixed, faculty2: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const Society = mongoose.model('Society', societySchema);
export default Society;