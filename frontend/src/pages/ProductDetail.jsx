import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaHeart, FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Loader from '../components/common/Loader';
import ProductCard from '../components/products/ProductCard';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist } = useWishlist();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' });
    const [similarProducts, setSimilarProducts] = useState([]);

    useEffect(() => {
        fetchProduct();
        loadReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProduct = async () => {
        try {
            const data = await productService.getProduct(id);
            setProduct(data.product);
            fetchSimilarProducts(data.product.category, data.product._id);
        } catch (error) {
            toast.error('Failed to load product');
            navigate('/shop');
        } finally {
            setLoading(false);
        }
    };

    const fetchSimilarProducts = async (category, currentProductId) => {
        try {
            const response = await productService.getProducts({
                category: category,
                limit: 4
            });
            const filtered = response.products.filter(p => p._id !== currentProductId);
            setSimilarProducts(filtered.slice(0, 4));
        } catch (error) {
            console.error('Failed to fetch similar products:', error);
        }
    };

    const loadReviews = () => {
        const savedReviews = localStorage.getItem(`reviews_${id}`);
        if (savedReviews) {
            setReviews(JSON.parse(savedReviews));
        }
    };

    const saveReviews = (updatedReviews) => {
        localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
        setReviews(updatedReviews);
    };

    const handleAddReview = (e) => {
        e.preventDefault();
        if (!newReview.name.trim() || !newReview.comment.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        const review = {
            id: Date.now(),
            ...newReview,
            date: new Date().toLocaleDateString()
        };

        const updatedReviews = [review, ...reviews];
        saveReviews(updatedReviews);
        setNewReview({ rating: 5, comment: '', name: '' });
        toast.success('Review added successfully!');
    };

    const handleWhatsAppOrder = () => {
        let message = `Hi, I'm interested in ordering:\\n\\n*${product.name}*\\nCategory: ${product.category}\\nPrice: ₹${finalPrice.toLocaleString()}\\nQuantity: ${quantity}`;
        if (selectedColor) {
            message += `\\nColor: ${selectedColor}`;
        }
        message += `\\n\\nProduct Link: ${window.location.href}`;
        const whatsappUrl = `https://wa.me/9604934590?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleAddToCart = () => {
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            toast.error('Please select a color');
            return;
        }
        addToCart(product, quantity, selectedColor);
        toast.success(`Added ${quantity} item(s) to cart!`);
    };

    const handleAddToWishlist = () => {
        addToWishlist(product);
        toast.success('Added to wishlist!');
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= 99) {
            setQuantity(newQuantity);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className="star filled" />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="star filled" />);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} className="star" />);
        }
        return stars;
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    if (loading) {
        return (
            <div className="product-detail-page">
                <div className="container">
                    <Loader />
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const finalPrice = product.discount > 0
        ? product.price - (product.price * product.discount / 100)
        : product.price;

    return (
        <div className="product-detail-page">
            <div className="container">
                {/* Product Section */}
                <div className="product-detail-grid">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img src={product.images[selectedImage]} alt={product.name} />
                        </div>
                        {product.images.length > 1 && (
                            <div className="thumbnail-list">
                                {product.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={image} alt={`${product.name} ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        <h1 className="product-title">{product.name}</h1>

                        <div className="product-rating">
                            <div className="stars">
                                {renderStars(parseFloat(calculateAverageRating()))}
                            </div>
                            <span className="rating-text">
                                {calculateAverageRating()} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                            </span>
                        </div>

                        <div className="product-price">
                            <span className="current-price">₹{finalPrice.toLocaleString()}</span>
                            {product.discount > 0 && (
                                <>
                                    <span className="original-price">₹{product.price.toLocaleString()}</span>
                                    <span className="discount-badge">{product.discount}% OFF</span>
                                </>
                            )}
                        </div>

                        {/* Color Selector */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="product-option">
                                <label className="option-label">Color</label>
                                <select
                                    className="option-select"
                                    value={selectedColor}
                                    onChange={(e) => setSelectedColor(e.target.value)}
                                >
                                    <option value="">Select a color</option>
                                    {product.colors.map((color, index) => (
                                        <option key={index} value={color}>{color}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="product-option">
                            <label className="option-label">Quantity</label>
                            <div className="quantity-selector">
                                <button
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    className="quantity-input"
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                    min="1"
                                    max="99"
                                />
                                <button
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={quantity >= 99}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        <div className="product-meta">
                            <div className="meta-item">
                                <span className="meta-label">Category:</span>
                                <span className="meta-value">{product.category}</span>
                            </div>
                            {product.material && (
                                <div className="meta-item">
                                    <span className="meta-label">Material:</span>
                                    <span className="meta-value">{product.material}</span>
                                </div>
                            )}
                            {product.weight && product.weight > 0 && (
                                <div className="meta-item">
                                    <span className="meta-label">Weight:</span>
                                    <span className="meta-value">{product.weight}g</span>
                                </div>
                            )}
                            {product.purity && (
                                <div className="meta-item">
                                    <span className="meta-label">Purity:</span>
                                    <span className="meta-value">{product.purity}</span>
                                </div>
                            )}
                        </div>

                        <div className="product-actions">
                            <button
                                onClick={handleAddToCart}
                                className="btn btn-primary btn-add-to-cart"
                            >
                                <FaShoppingCart /> Add to Cart
                            </button>
                            <button
                                onClick={handleWhatsAppOrder}
                                className="btn btn-whatsapp"
                            >
                                <FaWhatsapp /> Order via WhatsApp
                            </button>
                            <button
                                onClick={handleAddToWishlist}
                                className={`btn btn-wishlist ${isInWishlist(product._id) ? 'active' : ''}`}
                            >
                                <FaHeart />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h2>Customer Reviews</h2>

                    {/* Add Review Form */}
                    <div className="add-review">
                        <h3>Write a Review</h3>
                        <form onSubmit={handleAddReview}>
                            <div className="form-group">
                                <label>Your Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newReview.name}
                                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Rating *</label>
                                <div className="rating-input">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <label key={star}>
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={star}
                                                checked={newReview.rating === star}
                                                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                            />
                                            <span>{star} {renderStars(star)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Your Review *</label>
                                <textarea
                                    className="form-textarea"
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    placeholder="Share your experience with this product..."
                                    rows="4"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Submit Review
                            </button>
                        </form>
                    </div>

                    {/* Reviews List */}
                    <div className="reviews-list">
                        {reviews.length === 0 ? (
                            <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="review-card">
                                    <div className="review-header">
                                        <div>
                                            <h4>{review.name}</h4>
                                            <div className="stars">{renderStars(review.rating)}</div>
                                        </div>
                                        <span className="review-date">{review.date}</span>
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Similar Products Section */}
                {similarProducts.length > 0 && (
                    <div className="similar-products-section">
                        <h2>Similar Products You May Like</h2>
                        <div className="similar-products-grid">
                            {similarProducts.map((similarProduct) => (
                                <ProductCard key={similarProduct._id} product={similarProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
