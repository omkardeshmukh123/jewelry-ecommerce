const Review = require('../models/Review');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// @desc    Get all reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getProductReviews = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const sort = req.query.sort || '-createdAt'; // newest first by default
        const startIndex = (page - 1) * limit;

        const total = await Review.countDocuments({ product: productId });

        const reviews = await Review.find({ product: productId })
            .sort(sort)
            .skip(startIndex)
            .limit(limit)
            .populate('user', 'name profilePicture');

        // Rating breakdown stats
        const ratingStats = await Review.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: -1 } },
        ]);

        // Build a 1–5 breakdown map
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        ratingStats.forEach((stat) => {
            breakdown[stat._id] = stat.count;
        });

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            breakdown,
            reviews,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a review
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const userId = req.user.id;

        // Check if user has already reviewed this product
        const existingReview = await Review.findOne({
            product: productId,
            user: userId,
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product. Edit your existing review.',
            });
        }

        // Check if user has purchased this product (for verified purchase badge)
        let verifiedPurchase = false;
        const order = await Order.findOne({
            user: userId,
            status: { $in: ['delivered', 'confirmed', 'shipped'] },
            'items.product': productId,
        });
        if (order) verifiedPurchase = true;

        const review = await Review.create({
            product: productId,
            user: userId,
            rating: req.body.rating,
            title: req.body.title,
            comment: req.body.comment,
            verifiedPurchase,
        });

        await review.populate('user', 'name profilePicture');

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully!',
            review,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product.',
            });
        }
        next(error);
    }
};

// @desc    Update a review
// @route   PUT /api/products/:productId/reviews/:reviewId
// @access  Private (own review only)
exports.updateReview = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Only the owner can update
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review',
            });
        }

        review.rating = req.body.rating ?? review.rating;
        review.title = req.body.title ?? review.title;
        review.comment = req.body.comment ?? review.comment;
        await review.save();

        await review.populate('user', 'name profilePicture');

        res.status(200).json({
            success: true,
            message: 'Review updated successfully!',
            review,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a review
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private (own review or admin)
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review',
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle helpful vote on a review
// @route   PUT /api/products/:productId/reviews/:reviewId/helpful
// @access  Private
exports.toggleHelpful = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        if (review.user.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You can't vote your own review as helpful",
            });
        }

        const userId = req.user._id;
        const alreadyVoted = review.helpfulVotedBy.includes(userId);

        if (alreadyVoted) {
            // Remove vote
            review.helpfulVotedBy = review.helpfulVotedBy.filter(
                (id) => id.toString() !== req.user.id
            );
            review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
        } else {
            // Add vote
            review.helpfulVotedBy.push(userId);
            review.helpfulVotes += 1;
        }

        await review.save();

        res.status(200).json({
            success: true,
            helpful: !alreadyVoted,
            helpfulVotes: review.helpfulVotes,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user's review for a product
// @route   GET /api/products/:productId/reviews/my-review
// @access  Private
exports.getMyReview = async (req, res, next) => {
    try {
        const review = await Review.findOne({
            product: req.params.productId,
            user: req.user.id,
        }).populate('user', 'name profilePicture');

        res.status(200).json({
            success: true,
            review: review || null,
        });
    } catch (error) {
        next(error);
    }
};
