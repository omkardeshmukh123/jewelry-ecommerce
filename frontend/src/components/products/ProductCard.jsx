import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart, isInCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        toggleWishlist(product);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    return (
        <Link to={`/product/${product._id}`} className="product-card">
            <div className="product-image-container">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                />
                {product.discount > 0 && (
                    <span className="product-badge">{product.discount}% OFF</span>
                )}
                <button
                    className={`product-wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                    onClick={handleWishlistToggle}
                >
                    <FaHeart />
                </button>
            </div>

            <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>

                <div className="product-footer">
                    <div className="product-price-container">
                        {product.discount > 0 ? (
                            <>
                                <span className="product-price">{formatPrice(product.finalPrice)}</span>
                                <span className="product-price-original">{formatPrice(product.price)}</span>
                            </>
                        ) : (
                            <span className="product-price">{formatPrice(product.price)}</span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className={`product-cart-btn ${isInCart(product._id) ? 'in-cart' : ''}`}
                        disabled={product.stock === 0}
                    >
                        <FaShoppingCart />
                        <span>{product.stock === 0 ? 'Out' : isInCart(product._id) ? 'Added' : 'Add'}</span>
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
