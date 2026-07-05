import mongoose from 'mongoose';

const eventSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String }, // optional, for fallback compatibility it's 'desc'
    desc: { type: String },
    date: { type: String, required: true }, // Changed from Date to String for frontend matching format
    location: { type: String },
    venue: { type: String },
    banner: { type: String }, // Image URL
    isPublished: { type: Boolean, default: true },
    isRegistrationOpen: { type: Boolean, default: false },
    gallery: [{ type: String }], // Array of Image URLs
    tag: { type: String },
    highlights: { type: String },
    isHighlighted: { type: Boolean, default: false },
    highlightOrder: { type: Number },
    highlightDescription: { type: String },
    highlightImage: { type: String },
    highlightTheme: { type: String },
    link: { type: String },
    time: { type: String }
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;
