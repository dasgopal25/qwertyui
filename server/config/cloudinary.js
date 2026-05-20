const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const photoStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'wish-creator/photos', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});

const screenshotStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'wish-creator/payments', allowed_formats: ['jpg', 'jpeg', 'png'] },
});

const uploadPhotos      = multer({ storage: photoStorage });
const uploadScreenshot  = multer({ storage: screenshotStorage });

module.exports = { cloudinary, uploadPhotos, uploadScreenshot };
