const router = require('express').Router();
const { login, setup } = require('../controllers/authController');
router.post('/login', login);
router.post('/setup', setup);
module.exports = router;
