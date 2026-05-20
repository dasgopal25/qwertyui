const router = require('express').Router();
const Template = require('../models/Template');
router.get('/', async (req, res) => {
  const { wishType } = req.query;
  const q = wishType ? { wishType, isActive: true } : { isActive: true };
  const templates = await Template.find(q).sort({ sortOrder: 1 });
  res.json(templates);
});
module.exports = router;
