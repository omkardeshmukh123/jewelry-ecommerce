import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGem, FaShippingFast, FaUndo, FaShieldAlt } from 'react-icons/fa';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import { productService } from '../services/productService';
// import { useParallax } from '../hooks/useParallax';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Parallax effect for hero section (currently unused)
    // const parallaxOffset = useParallax(0.5);

    // Scroll animations for sections
    const [featuresRef, featuresVisible] = useScrollAnimation({ once: true, threshold: 0.2 });
    const [productsRef, productsVisible] = useScrollAnimation({ once: true, threshold: 0.1 });

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await productService.getFeaturedProducts();
            setFeaturedProducts(response.products || []);
        } catch (error) {
            console.error('Error fetching featured products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section - Classic Elegance */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Discover Timeless <span className="gradient-text">Elegance</span>
                        </h1>
                        <p className="hero-subtitle">
                            Exquisite fashion jewelry crafted with precision and passion.
                            Explore our curated collection of premium anti-tarnish imitation pieces.
                        </p>
                        <div className="hero-actions">
                            <Link to="/shop" className="btn btn-primary">
                                Explore Collection
                            </Link>
                            <Link to="/about" className="btn btn-secondary">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Gallery Section */}
            <section className="gallery-section section">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Exquisite Collection</h2>
                        <p>Handcrafted jewelry pieces that define elegance and sophistication</p>
                    </div>

                    <div className="gallery-grid">
                        <div className="gallery-item">
                            <div className="gallery-image">
                                <img
                                    src={`${process.env.PUBLIC_URL}/gallery-1.jpg`}
                                    alt="Drisora Jewelry Collection - Gold Hoops and Accessories"
                                />
                                <div className="gallery-overlay">
                                    <div className="gallery-content">
                                        <h3>Statement Pieces</h3>
                                        <p>Bold hoops, elegant bracelets, and timeless accessories</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="gallery-item">
                            <div className="gallery-image">
                                <img
                                    src={`${process.env.PUBLIC_URL}/gallery-2.jpg`}
                                    alt="Drisora Jewelry - Delicate Necklaces and Earrings"
                                />
                                <div className="gallery-overlay">
                                    <div className="gallery-content">
                                        <h3>Delicate Designs</h3>
                                        <p>Graceful necklaces and charming earrings for every occasion</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="gallery-item">
                            <div className="gallery-image">
                                <img
                                    src={`${process.env.PUBLIC_URL}/gallery-3.jpg`}
                                    alt="Drisora Jewelry - Rings and Accessories Collection"
                                />
                                <div className="gallery-overlay">
                                    <div className="gallery-content">
                                        <h3>Everyday Elegance</h3>
                                        <p>Versatile rings, chains, and accessories for daily wear</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section with Scroll Animation */}
            <section
                ref={featuresRef}
                className="features-section section"
            >
                <div className="container">
                    <div className="features-grid">
                        <div className={`feature-card scroll-reveal scroll-reveal-stagger ${featuresVisible ? 'visible' : ''}`}>
                            <div className="feature-icon">
                                <FaGem />
                            </div>
                            <h3>Anti-Tarnish Quality</h3>
                            <p>Premium anti-tarnish coating for long-lasting shine</p>
                        </div>

                        <div className={`feature-card scroll-reveal scroll-reveal-stagger ${featuresVisible ? 'visible' : ''}`}>
                            <div className="feature-icon">
                                <FaShippingFast />
                            </div>
                            <h3>Free Shipping</h3>
                            <p>Complimentary shipping on all orders nationwide</p>
                        </div>

                        <div className={`feature-card scroll-reveal scroll-reveal-stagger ${featuresVisible ? 'visible' : ''}`}>
                            <div className="feature-icon">
                                <FaUndo />
                            </div>
                            <h3>Easy Returns</h3>
                            <p>7-day hassle-free return and exchange policy</p>
                        </div>

                        <div className={`feature-card scroll-reveal scroll-reveal-stagger ${featuresVisible ? 'visible' : ''}`}>
                            <div className="feature-icon">
                                <FaShieldAlt />
                            </div>
                            <h3>Secure Payment</h3>
                            <p>100% secure and encrypted payment processing</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section with Scroll Animation */}
            <section
                ref={productsRef}
                className="section"
            >
                <div className="container">
                    <div className={`section-header scroll-reveal ${productsVisible ? 'visible' : ''}`}>
                        <h2>Featured Collection</h2>
                        <p>Handpicked pieces that define elegance and sophistication</p>
                    </div>

                    {loading ? (
                        <div className="text-center">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <div className="products-grid">
                                {featuredProducts.slice(0, 4).map((product) => (
                                    <div
                                        key={product._id}
                                        className={`scroll-reveal scroll-reveal-stagger ${productsVisible ? 'visible' : ''}`}
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>

                            <div className={`section-footer scroll-reveal ${productsVisible ? 'visible' : ''}`}>
                                <Link to="/shop" className="btn btn-primary">
                                    View All Products
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
