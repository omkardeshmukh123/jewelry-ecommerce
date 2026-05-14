import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaHeart, FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Loader from '../components/common/Loader';
import ProductCard from '../components/products/ProductCard';
import ReviewSection from '../components/products/ReviewSection';
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
    const [similarProducts, setSimilarProducts] = useState([]);

    useEffect(() => {
        fetchProduct();
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
            // Error handled silently
        }
    };



    const handleWhatsAppOrder = () => {
        // Create a well-formatted WhatsApp message
        let message = `🛍️ *DRISORA - New Order Inquiry*\n\n`;
        message += `📦 *Product Details:*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━\n`;
        message += `🏷️ Product: *${product.name}*\n`;
        message += `📂 Category: ${product.category}\n`;
        message += `💰 Price: ₹${finalPrice.toLocaleString()}\n`;

        if (product.discount > 0) {
            message += `🎁 Discount: ${product.discount}% OFF\n`;
            message += `~~₹${product.price.toLocaleString()}~~ → ₹${finalPrice.toLocaleString()}\n`;
        }

        message += `📊 Quantity: ${quantity}\n`;

        if (selectedColor) {
            message += `🎨 Color: ${selectedColor}\n`;
        }

        message += `\n💵 *Total Amount: ₹${(finalPrice * quantity).toLocaleString()}*\n\n`;

        message += `🔗 Product Link:\n${window.location.href}\n\n`;

        message += `✨ _Thank you for choosing Drisora!_`;

        const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || '919604934590';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
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
        for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={i} className="star filled" />);
        if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" className="star filled" />);
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={`empty-${i}`} className="star" />);
        return stars;
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
                                {renderStars(parseFloat(product.avgRating || 0))}
                            </div>
                            <span className="rating-text">
                                {product.avgRating > 0 ? product.avgRating.toFixed(1) : 'No ratings yet'}
                                {product.numReviews > 0 && ` (${product.numReviews} ${product.numReviews === 1 ? 'review' : 'reviews'})`}
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
                <ReviewSection
                    productId={id}
                    avgRating={product.avgRating || 0}
                    numReviews={product.numReviews || 0}
                />

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
