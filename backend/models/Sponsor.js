import mongoose from 'mongoose';

const sponsorSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true }, // Image URL
    websiteUrl: { type: String },
    tier: { type: String }, // e.g., 'Gold', 'Silver'
  },
  {
    timestamps: true,
  }
);

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

export default Sponsor;
