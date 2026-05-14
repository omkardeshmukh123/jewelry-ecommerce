const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Review must belong to a product'],
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user'],
            index: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please provide a rating'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        title: {
            type: String,
            trim: true,
            maxlength: [100, 'Review title cannot exceed 100 characters'],
        },
        comment: {
            type: String,
            required: [true, 'Please provide a review comment'],
            trim: true,
            maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
        },
        helpfulVotes: {
            type: Number,
            default: 0,
        },
        helpfulVotedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        verifiedPurchase: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate reviews — one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to calculate and save average rating on Product
reviewSchema.statics.calcAverageRating = async function (productId) {
    const Product = require('./Product');

    const stats = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                avgRating: { $avg: '$rating' },
                numReviews: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            avgRating: Math.round(stats[0].avgRating * 10) / 10,
            numReviews: stats[0].numReviews,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            avgRating: 0,
            numReviews: 0,
        });
    }
};

// Recalculate after save
reviewSchema.post('save', function () {
    this.constructor.calcAverageRating(this.product);
});

// Recalculate after delete
reviewSchema.post('deleteOne', { document: true, query: false }, function () {
    this.constructor.calcAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
