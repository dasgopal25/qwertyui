const router = require('express').Router();
const { getPaymentQR } = require('../controllers/wishController');
router.get('/payment-qr', getPaymentQR);
module.exports = router;
