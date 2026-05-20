const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    wishType:     { type: String, required: true },
    templateId:   { type: String, required: true, unique: true },
    name:         { type: String, required: true },
    previewImage: { type: String, default: '' },
    description:  { type: String, default: '' },
    isActive:     { type: Boolean, default: true },
    sortOrder:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Template', templateSchema);
