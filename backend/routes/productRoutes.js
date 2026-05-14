const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

// Re-route into review router for nested /api/products/:productId/reviews
router.use('/:productId/reviews', reviewRoutes);

router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
