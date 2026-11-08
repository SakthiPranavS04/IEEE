import mongoose from 'mongoose';

const newsletterSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    society: {
      type: String,
      required: true,
      default: 'KEC IEEE SB',
    },
    volume: {
      type: String,
      required: true,
      default: 'Volume 1 • Issue 1',
    },
    date: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    editorial: {
      type: String,
      required: true,
    },
    highlights: [
      {
        type: String,
      },
    ],
    pages: {
      type: Number,
      default: 20,
    },
    editor: {
      type: String,
      default: 'Student Branch Editorial Board',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;

