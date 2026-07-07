import mongoose from 'mongoose';

const requestSchema = mongoose.Schema(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    form_slug: {
      type: String,
      required: true,
    },
    form_name: {
      type: String,
      required: true,
    },
    submitted_at: {
      type: Date,
      default: Date.now,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model('Request', requestSchema);

export default Request;
