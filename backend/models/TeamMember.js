import mongoose from 'mongoose';

const teamMemberSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'Executive', 'Coordinator'
    image: { type: String }, // Image URL
    linkedin: { type: String },
    github: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;
