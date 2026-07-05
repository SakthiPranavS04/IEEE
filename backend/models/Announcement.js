import mongoose from 'mongoose';

const announcementSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String },
    source: { type: String },
    color: { type: String },
    date: { type: Date, required: true, default: Date.now },
    isPublished: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
