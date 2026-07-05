import mongoose from 'mongoose';

const documentSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: String, required: true },
    uploadDate: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    fileUrl: { type: String },
    isVisible: { type: Boolean, required: true, default: true },
    isFeatured: { type: Boolean, required: true, default: false },
    featuredOrder: { type: Number, required: true, default: 99 },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model('Document', documentSchema);

export default Document;
