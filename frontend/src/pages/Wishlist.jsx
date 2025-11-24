import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart, isInCart } = useCart();
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
    };

    const handleRemove = (productId, productName) => {
        removeFromWishlist(productId);
        toast.info(`${productName} removed from wishlist`);
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="wishlist-empty">
                <div className="container">
                    <div className="empty-content">
                        <FaHeart className="empty-icon" />
                        <h2>Your Wishlist is Empty</h2>
                        <p>Save your favorite jewelry pieces here!</p>
                        <button onClick={() => navigate('/shop')} className="btn btn-primary">
                            Browse Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="container">
                <div className="wishlist-header">
                    <h1 className="wishlist-title">
                        My <span className="gradient-text">Wishlist</span>
                    </h1>
                    <p className="wishlist-subtitle">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                <div className="wishlist-actions">
                    <button onClick={clearWishlist} className="btn btn-outline">
                        <FaTrash /> Clear Wishlist
                    </button>
                </div>

                <div className="wishlist-grid">
                    {wishlistItems.map((product) => {
                        const price = product.finalPrice || product.price;
                        return (
                            <div key={product._id} className="wishlist-item">
                                <div className="wishlist-item-image">
                                    <img src={product.images[0]} alt={product.name} />
                                    {product.discount > 0 && (
                                        <span className="wishlist-badge">{product.discount}% OFF</span>
                                    )}
                                </div>

                                <div className="wishlist-item-details">
                                    <div className="wishlist-item-category">{product.category}</div>
                                    <h3 className="wishlist-item-name">{product.name}</h3>

                                    <div className="wishlist-item-specs">
                                        <span>{product.material}</span>
                                        {product.purity && <span>{product.purity}</span>}
                                    </div>

                                    <div className="wishlist-item-price">
                                        {product.discount > 0 ? (
                                            <>
                                                <span className="price-current">{formatPrice(price)}</span>
                                                <span className="price-original">{formatPrice(product.price)}</span>
                                            </>
                                        ) : (
                                            <span className="price-current">{formatPrice(product.price)}</span>
                                        )}
                                    </div>

                                    <div className="wishlist-item-actions">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className={`btn ${isInCart(product._id) ? 'btn-secondary' : 'btn-primary'}`}
                                            disabled={product.stock === 0}
                                        >
                                            <FaShoppingCart />
                                            {product.stock === 0 ? 'Out of Stock' : isInCart(product._id) ? 'In Cart' : 'Add to Cart'}
                                        </button>
                                        <button
                                            onClick={() => handleRemove(product._id, product.name)}
                                            className="btn btn-outline wishlist-remove-btn"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
