const express = require('express');
const {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    toggleHelpful,
    getMyReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true }); // mergeParams to get :productId from parent

router.get('/my-review', protect, getMyReview);
router.get('/', getProductReviews);
router.post('/', protect, createReview);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);
router.put('/:reviewId/helpful', protect, toggleHelpful);

module.exports = router;
