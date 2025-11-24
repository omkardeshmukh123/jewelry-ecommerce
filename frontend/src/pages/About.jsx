import React from 'react';
import { Link } from 'react-router-dom';
import { FaGem, FaShieldAlt, FaAward, FaHeart } from 'react-icons/fa';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <h1 className="about-hero-title">
                        About <span className="gradient-text">Drisora</span>
                    </h1>
                    <p className="about-hero-subtitle">
                        Crafting timeless elegance since our inception
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="about-story section">
                <div className="container">
                    <div className="story-content">
                        <div className="story-text">
                            <h2>Our Story</h2>
                            <p>
                                Drisora was born from a passion for creating exquisite jewelry that tells a story.
                                Each piece in our collection is meticulously crafted to celebrate life's precious moments
                                and milestones.
                            </p>
                            <p>
                                We believe that jewelry is more than just an accessory – it's a reflection of your
                                personality, a symbol of love, and a treasure to be cherished for generations. Our
                                commitment to quality, style, and customer satisfaction drives everything we do.
                            </p>
                            <p>
                                From traditional designs to contemporary masterpieces, Drisora brings you a curated
                                collection of premium anti-tarnish fashion jewelry that combines timeless elegance with
                                modern craftsmanship.
                            </p>
                        </div>
                        <div className="story-image">
                            <div className="story-image-placeholder">
                                <FaGem className="story-icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-values section">
                <div className="container">
                    <h2 className="text-center">Our Values</h2>
                    <p className="text-center" style={{ marginBottom: '3rem', color: 'var(--text-secondary)' }}>
                        The principles that guide us in everything we do
                    </p>

                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">
                                <FaGem />
                            </div>
                            <h3>Quality Assurance</h3>
                            <p>
                                Every piece features premium anti-tarnish coating for long-lasting shine. We stand behind
                                the quality and durability of every item we sell.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <FaAward />
                            </div>
                            <h3>Craftsmanship</h3>
                            <p>
                                Our artisans bring decades of experience and expertise to create jewelry
                                that showcases exceptional attention to detail.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <FaShieldAlt />
                            </div>
                            <h3>Trust</h3>
                            <p>
                                We build lasting relationships with our customers through transparency,
                                honesty, and unwavering commitment to their satisfaction.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <FaHeart />
                            </div>
                            <h3>Passion</h3>
                            <p>
                                Our love for jewelry drives us to constantly innovate and bring you
                                designs that capture the essence of beauty and elegance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="about-why section">
                <div className="container">
                    <div className="why-content">
                        <div className="why-image">
                            <div className="why-image-placeholder">
                                <FaAward className="why-icon" />
                            </div>
                        </div>
                        <div className="why-text">
                            <h2>Why Choose Drisora?</h2>
                            <ul className="why-list">
                                <li>
                                    <strong>Anti-Tarnish Quality:</strong> All our jewelry features premium anti-tarnish
                                    coating for long-lasting shine and durability.
                                </li>
                                <li>
                                    <strong>Exquisite Designs:</strong> From traditional to contemporary, we offer
                                    a diverse range of designs to suit every taste.
                                </li>
                                <li>
                                    <strong>Affordable Luxury:</strong> Premium fashion jewelry at accessible prices, with
                                    regular discounts and special offers.
                                </li>
                                <li>
                                    <strong>Secure Shopping:</strong> Your transactions are protected with
                                    industry-standard security measures.
                                </li>
                                <li>
                                    <strong>Easy Returns:</strong> 7-day hassle-free return and exchange policy
                                    for your peace of mind.
                                </li>
                                <li>
                                    <strong>Customer Support:</strong> Our dedicated team is always ready to
                                    assist you with any queries.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Find Your Perfect Piece?</h2>
                        <p>Explore our exquisite collection of handcrafted jewelry</p>
                        <div className="cta-buttons">
                            <Link to="/shop" className="btn btn-primary">
                                Browse Collection
                            </Link>
                            <Link to="/contact" className="btn btn-secondary">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
