import mongoose from 'mongoose';

const settingSchema = mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // Keeping 'key' as the controller relies on it
    value: { type: mongoose.Schema.Types.Mixed }, // To store varying setting types
    description: { type: String }, // Provided to match controller
    
    // Explicit fields requested by user
    websiteName: { type: String },
    logo: { type: String },
    favicon: { type: String },
    footerText: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      github: { type: String },
    },
    themeSettings: { type: mongoose.Schema.Types.Mixed },
    maintenanceMode: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;
