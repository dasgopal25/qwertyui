const Submission = require('../models/Submission');
const { Settings } = require('../models/Admin');
const { generateSlug } = require('../utils/generateSlug');

const WISH_TYPES = [
  { id: 'birthday',      label: 'Birthday Wish',      emoji: '🎂', templateCount: 10 },
  { id: 'anniversary',   label: 'Anniversary Wish',   emoji: '💕', templateCount: 8  },
  { id: 'mothers-day',   label: "Mother's Day Wish",  emoji: '👩', templateCount: 7  },
  { id: 'fathers-day',   label: "Father's Day Wish",  emoji: '👨', templateCount: 7  },
  { id: 'first-meeting', label: 'First Meeting Day',  emoji: '🤝', templateCount: 8  },
  { id: 'period-day',    label: 'Period Day Wish',     emoji: '🩸', templateCount: 7  },
  { id: 'friendship',    label: 'Friendship Day Wish', emoji: '👫', templateCount: 8  },
  { id: 'valentines',    label: "Valentine's Day Wish",emoji: '❤️', templateCount: 10 },
  { id: 'womens-day',    label: "Women's Day Wish",    emoji: '🌸', templateCount: 8  },
  { id: 'teachers-day',  label: "Teacher's Day Wish",  emoji: '📚', templateCount: 7  },
  { id: 'custom',        label: 'Custom Special Wish', emoji: '🎊', templateCount: 9  },
  { id: 'surprise',      label: 'Surprise Wish',       emoji: '🌟', templateCount: 7  },
];

// GET /api/wishes/types
exports.getWishTypes = (req, res) => {
  res.json(WISH_TYPES);
};

// POST /api/wishes/submit
exports.submitWish = async (req, res) => {
  try {
    const {
      wishType, templateId, recipientName, senderName,
      specialDate, message, language, colorTheme,
      userWhatsApp, userEmail,
    } = req.body;

    const photos = req.files ? req.files.map((f) => f.path) : [];
    const slug   = await generateSlug();

    const submission = await Submission.create({
      slug, wishType, templateId, recipientName, senderName,
      specialDate, message, language: language || 'en',
      colorTheme: colorTheme || '#ff69b4',
      photos, userWhatsApp, userEmail,
    });

    const settings = await Settings.findOne();
    res.status(201).json({
      submissionId: submission._id,
      slug,
      whatsappNumber: settings?.whatsappNumber || '6295432911',
      priceInr: settings?.priceInr || 49,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/wishes/payment-screenshot
exports.uploadPaymentScreenshot = async (req, res) => {
  try {
    const { submissionId } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No screenshot uploaded' });

    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      { paymentScreenshot: req.file.path },
      { new: true }
    );
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    res.json({ message: 'Screenshot uploaded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/wishes/:slug
exports.getWishBySlug = async (req, res) => {
  try {
    const submission = await Submission.findOne({ slug: req.params.slug });
    if (!submission) return res.status(404).json({ message: 'Wish not found' });

    if (!submission.linkActive)
      return res.status(403).json({ message: 'expired', active: false });

    if (submission.expiresAt && submission.expiresAt < new Date()) {
      await Submission.findByIdAndUpdate(submission._id, { linkActive: false });
      return res.status(403).json({ message: 'expired', active: false });
    }

    res.json({
      slug:          submission.slug,
      wishType:      submission.wishType,
      templateId:    submission.templateId,
      recipientName: submission.recipientName,
      senderName:    submission.senderName,
      specialDate:   submission.specialDate,
      message:       submission.message,
      language:      submission.language,
      photos:        submission.photos,
      colorTheme:    submission.colorTheme,
      expiresAt:     submission.expiresAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/settings/payment-qr
exports.getPaymentQR = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json({
      qrCodeUrl:      settings?.qrCodeUrl || '',
      priceInr:       settings?.priceInr || 49,
      whatsappNumber: settings?.whatsappNumber || '6295432911',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
