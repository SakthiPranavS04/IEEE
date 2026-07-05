import mongoose from 'mongoose';

const teamMemberSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    category: { type: String, required: true }, // acts as branch/society
    type: { type: String, enum: ['Faculty', 'Student'], default: 'Student' },
    image: { type: String }, // Image URL
    linkedin: { type: String },
    github: { type: String },
    email: { type: String },
    phone: { type: String },
    department: { type: String },
    year: { type: String },
    ieeeNumber: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;
