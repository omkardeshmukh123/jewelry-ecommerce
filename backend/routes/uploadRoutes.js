const express = require('express');
const rateLimit = require('express-rate-limit');
const { uploadImages, deleteImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Strict rate limit: 10 uploads per 15 minutes per IP
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many uploads. Please wait before uploading more images.',
});

// Both routes require admin auth + upload rate limit
router.post('/images', protect, authorize('admin'), uploadLimiter, uploadImages);
router.delete('/images', protect, authorize('admin'), deleteImage);

module.exports = router;
