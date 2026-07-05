import mongoose from 'mongoose';

const joinRegistrationSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    membershipType: { type: String, required: true },
    resume: { type: String }, // URL to uploaded resume
    portfolio: { type: String },
    github: { type: String },
    linkedin: { type: String },
    status: { type: String, required: true, default: 'Pending' },
  },
  {
    timestamps: true,
  }
);

const JoinRegistration = mongoose.model('JoinRegistration', joinRegistrationSchema);

export default JoinRegistration;
