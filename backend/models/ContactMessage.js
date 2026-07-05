import mongoose from 'mongoose';

const contactMessageSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    department: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, required: true, default: 'Pending' },
    ipAddress: { type: String },
    browser: { type: String },
    operatingSystem: { type: String },
    country: { type: String },
  },
  {
    timestamps: true,
  }
);

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
