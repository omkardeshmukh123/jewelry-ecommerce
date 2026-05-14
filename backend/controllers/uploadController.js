const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');
const { handleUpload } = require('../middleware/upload');

// @desc    Upload product images to S3
// @route   POST /api/upload/images
// @access  Private/Admin
exports.uploadImages = async (req, res, next) => {
    try {
        await handleUpload(req, res);

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please select at least one image to upload',
            });
        }

        const uploadedImages = req.files.map((file) => ({
            url: file.location,      // Public HTTPS URL from S3
            key: file.key,           // S3 key — needed for deletion
            size: file.size,
            mimetype: file.mimetype,
        }));

        res.status(200).json({
            success: true,
            message: `${uploadedImages.length} image(s) uploaded successfully`,
            images: uploadedImages,
        });
    } catch (error) {
        // Multer/S3 specific errors
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'Image too large. Maximum size is 5 MB.' });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ success: false, message: 'Too many files. Maximum 5 images allowed.' });
        }
        next(error);
    }
};

// @desc    Delete a single image from S3
// @route   DELETE /api/upload/images
// @access  Private/Admin
exports.deleteImage = async (req, res, next) => {
    try {
        const { key } = req.body;

        if (!key) {
            return res.status(400).json({ success: false, message: 'Image key is required' });
        }

        // Security: only allow deletion within the products/ prefix
        if (!key.startsWith('products/')) {
            return res.status(403).json({ success: false, message: 'Invalid image key' });
        }

        await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
            })
        );

        res.status(200).json({ success: true, message: 'Image deleted from S3' });
    } catch (error) {
        next(error);
    }
};
