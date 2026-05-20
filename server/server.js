const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cron = require('node-cron');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/wishes',    require('./routes/wishRoutes'));
app.use('/api/admin',     require('./routes/adminRoutes'));
app.use('/api/templates', require('./routes/templateRoutes'));
app.use('/api/settings',  require('./routes/settingsRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

// Error handler
app.use(require('./middleware/errorHandler'));

// Connect DB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    // Cron: deactivate expired links every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
      const Submission = require('./models/Submission');
      const result = await Submission.updateMany(
        { linkActive: true, expiresAt: { $lt: new Date() } },
        { $set: { linkActive: false } }
      );
      if (result.modifiedCount > 0)
        console.log(`⏰ Expired ${result.modifiedCount} wish link(s)`);
    });
  })
  .catch((err) => { console.error('❌ DB connection error:', err); process.exit(1); });
