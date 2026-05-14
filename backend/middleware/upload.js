const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const s3 = require('../config/s3');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 5;

// ── Multer-S3 storage ────────────────────────────────────────────
const storage = multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname, uploadedBy: req.user?.id || 'unknown' });
    },
    key: (req, file, cb) => {
        // products/<uuid>.<ext>  — keeps files organized & avoids name collisions
        const ext = path.extname(file.originalname).toLowerCase();
        const key = `products/${uuidv4()}${ext}`;
        cb(null, key);
    },
});

// ── File filter ──────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
    }
};

// ── Exported middleware ──────────────────────────────────────────
const uploadProductImages = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: MAX_FILES,
    },
}).array('images', MAX_FILES);

// Wrap in a promise so controllers can await it and get proper errors
const handleUpload = (req, res) =>
    new Promise((resolve, reject) => {
        uploadProductImages(req, res, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

module.exports = { handleUpload };
