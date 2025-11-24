import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { getCartCount } = useCart();
    const { getWishlistCount } = useWishlist();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    <img src="/drisora-logo.jpg" alt="Drisora Logo" className="logo-image" />
                    <span className="logo-text">Drisora</span>
                </Link>

                <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="navbar-link" onClick={closeMenu}>
                        Home
                    </Link>
                    <Link to="/shop" className="navbar-link" onClick={closeMenu}>
                        Shop
                    </Link>
                    <Link to="/about" className="navbar-link" onClick={closeMenu}>
                        About Us
                    </Link>
                    {isAuthenticated() && isAdmin() && (
                        <Link to="/admin" className="navbar-link" onClick={closeMenu}>
                            Admin Panel
                        </Link>
                    )}
                    {isAuthenticated() && (
                        <Link to="/orders" className="navbar-link" onClick={closeMenu}>
                            My Orders
                        </Link>
                    )}
                </div>

                <div className="navbar-actions">
                    <Link to="/wishlist" className="navbar-icon-btn" onClick={closeMenu}>
                        <FaHeart />
                        {getWishlistCount() > 0 && (
                            <span className="cart-badge">{getWishlistCount()}</span>
                        )}
                    </Link>

                    <Link to="/cart" className="navbar-icon-btn" onClick={closeMenu}>
                        <FaShoppingCart />
                        {getCartCount() > 0 && (
                            <span className="cart-badge">{getCartCount()}</span>
                        )}
                    </Link>

                    {isAuthenticated() ? (
                        <div className="navbar-user">
                            <button className="navbar-icon-btn user-btn">
                                <FaUser />
                            </button>
                            <div className="user-dropdown">
                                <div className="user-info">
                                    <p className="user-name">{user?.name}</p>
                                    <p className="user-email">{user?.email}</p>
                                </div>
                                <Link to="/profile" className="dropdown-link" onClick={closeMenu}>
                                    Profile
                                </Link>
                                <button onClick={handleLogout} className="dropdown-link logout-btn">
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-sm" onClick={closeMenu}>
                            Login
                        </Link>
                    )}

                    <button className="navbar-toggle" onClick={toggleMenu}>
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
