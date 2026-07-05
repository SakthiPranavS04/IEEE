import mongoose from 'mongoose';

const eventSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    banner: { type: String }, // Image URL
    isPublished: { type: Boolean, required: true, default: false },
    isRegistrationOpen: { type: Boolean, required: true, default: false },
    gallery: [{ type: String }], // Array of Image URLs
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;
