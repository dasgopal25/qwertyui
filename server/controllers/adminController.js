const Submission = require('../models/Submission');
const Template   = require('../models/Template');
const { Settings } = require('../models/Admin');

// GET /api/admin/submissions
exports.getSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, wishType, search } = req.query;
    const query = {};
    if (wishType) query.wishType = wishType;
    if (status === 'pending')    { query.paymentVerified = false; }
    if (status === 'verified')   { query.paymentVerified = true; query.linkActive = false; }
    if (status === 'active')     { query.linkActive = true; }
    if (status === 'expired')    { query.linkActive = false; query.paymentVerified = true; query.activatedAt = { $exists: true }; }
    if (search) query.$or = [
      { recipientName: { $regex: search, $options: 'i' } },
      { senderName:    { $regex: search, $options: 'i' } },
      { slug:          { $regex: search, $options: 'i' } },
    ];

    const total = await Submission.countDocuments(query);
    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ submissions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/submissions/:id
exports.getSubmission = async (req, res) => {
  try {
    const s = await Submission.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/submissions/:id/activate
exports.activateLink = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const hours = settings?.linkValidityHours || 24;
    const activatedAt = new Date();
    const expiresAt   = new Date(activatedAt.getTime() + hours * 60 * 60 * 1000);

    const s = await Submission.findByIdAndUpdate(
      req.params.id,
      { linkActive: true, paymentVerified: true, activatedAt, expiresAt },
      { new: true }
    );
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Link activated', expiresAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/submissions/:id/deactivate
exports.deactivateLink = async (req, res) => {
  try {
    await Submission.findByIdAndUpdate(req.params.id, { linkActive: false });
    res.json({ message: 'Link deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/submissions/:id/verify-payment
exports.verifyPayment = async (req, res) => {
  try {
    await Submission.findByIdAndUpdate(req.params.id, { paymentVerified: true });
    res.json({ message: 'Payment verified' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [total, pending, active, verified] = await Promise.all([
      Submission.countDocuments(),
      Submission.countDocuments({ paymentVerified: false }),
      Submission.countDocuments({ linkActive: true }),
      Submission.countDocuments({ paymentVerified: true }),
    ]);
    res.json({ total, pending, active, verified });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    Object.assign(settings, req.body);
    if (req.file) settings.qrCodeUrl = req.file.path;
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Templates CRUD
exports.getTemplates = async (req, res) => {
  try {
    const { wishType } = req.query;
    const query = wishType ? { wishType } : {};
    const templates = await Template.find(query).sort({ wishType: 1, sortOrder: 1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const t = await Template.create(req.body);
    res.status(201).json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const t = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
