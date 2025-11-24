const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a product name'],
            trim: true,
            maxlength: [100, 'Product name cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a product description'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide a product price'],
            min: [0, 'Price cannot be negative'],
        },
        category: {
            type: String,
            required: [true, 'Please provide a product category'],
            enum: [
                'Rings',
                'Necklaces',
                'Earrings',
                'Bracelets',
                'Bangles',
                'Pendants',
                'Chains',
                'Anklets',
                'Nose Pins',
                'Mangalsutra',
                'Other',
            ],
        },
        material: {
            type: String,
            required: [true, 'Please provide the material'],
            enum: ['Gold', 'Silver', 'Platinum', 'Diamond', 'Gemstone', 'Mixed'],
        },
        weight: {
            type: Number,
            min: [0, 'Weight cannot be negative'],
        },
        purity: {
            type: String,
            enum: ['14K', '18K', '22K', '24K', '925 Silver', 'Other'],
        },
        images: [
            {
                type: String,
                required: true,
            },
        ],
        stock: {
            type: Number,
            required: [true, 'Please provide stock quantity'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        discount: {
            type: Number,
            min: [0, 'Discount cannot be negative'],
            max: [100, 'Discount cannot exceed 100%'],
            default: 0,
        },
        colors: {
            type: [String],
            default: [],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Virtual for final price after discount
productSchema.virtual('finalPrice').get(function () {
    return this.price - (this.price * this.discount) / 100;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
