const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    slug:              { type: String, required: true, unique: true },
    wishType:          { type: String, required: true },
    templateId:        { type: String, required: true },
    recipientName:     { type: String, required: true },
    senderName:        { type: String, required: true },
    specialDate:       { type: Date },
    message:           { type: String, default: '' },
    language:          { type: String, enum: ['en', 'hi', 'bn'], default: 'en' },
    photos:            [{ type: String }],
    colorTheme:        { type: String, default: '#ff69b4' },
    paymentScreenshot: { type: String, default: '' },
    paymentVerified:   { type: Boolean, default: false },
    linkActive:        { type: Boolean, default: false },
    activatedAt:       { type: Date },
    expiresAt:         { type: Date },
    userWhatsApp:      { type: String, default: '' },
    userEmail:         { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
