import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <img src="/drisora-logo.jpg" alt="Drisora Logo" className="footer-logo-image" />
                            <span className="footer-logo-text">Drisora</span>
                        </div>
                        <p className="footer-description">
                            Discover exquisite jewelry crafted with precision and passion.
                            Your trusted destination for premium anti-tarnish fashion jewelry.
                        </p>
                        <div className="footer-social">
                            <a href="https://www.instagram.com/drisora_07/" target="_blank" rel="noopener noreferrer" className="social-link">
                                <FaInstagram />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <FaTwitter />
                            </a>
                            <a href="https://wa.me/9604934590" target="_blank" rel="noopener noreferrer" className="social-link">
                                <FaWhatsapp />
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/shop">Shop</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Categories</h3>
                        <ul className="footer-links">
                            <li><Link to="/shop?category=Rings">Rings</Link></li>
                            <li><Link to="/shop?category=Necklaces">Necklaces</Link></li>
                            <li><Link to="/shop?category=Earrings">Earrings</Link></li>
                            <li><Link to="/shop?category=Bracelets">Bracelets</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-title">Contact Us</h3>
                        <ul className="footer-contact">
                            <li>Email: info@drisora.com</li>
                            <li>Phone: +919604934590</li>
                            <li>Address: Pune , Maharashtra - 411052</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} Drisora. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms & Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
