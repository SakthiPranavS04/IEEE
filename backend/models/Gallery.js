import mongoose from 'mongoose';

const gallerySchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    images: [{ type: String }], // Updated from imageUrl to array of images to match frontend
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;
