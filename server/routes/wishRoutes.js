const router = require('express').Router();
const ctrl = require('../controllers/wishController');
const { uploadPhotos, uploadScreenshot } = require('../config/cloudinary');
router.get('/types', ctrl.getWishTypes);
router.post('/submit', uploadPhotos.array('photos', 10), ctrl.submitWish);
router.post('/payment-screenshot', uploadScreenshot.single('screenshot'), ctrl.uploadPaymentScreenshot);
router.get('/:slug', ctrl.getWishBySlug);
module.exports = router;
