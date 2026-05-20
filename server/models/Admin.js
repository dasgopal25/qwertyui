const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    username:     { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

const settingsSchema = new mongoose.Schema(
  {
    qrCodeUrl:          { type: String, default: '' },
    priceInr:           { type: Number, default: 49 },
    whatsappNumber:     { type: String, default: '6295432911' },
    linkValidityHours:  { type: Number, default: 24 },
    siteTitle:          { type: String, default: 'Wish Creator' },
    isMaintenanceMode:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Admin    = mongoose.model('Admin', adminSchema);
const Settings = mongoose.model('Settings', settingsSchema);

module.exports = { Admin, Settings };
