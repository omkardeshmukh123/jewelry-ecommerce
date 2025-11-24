import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create WhatsApp message
        const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || '9604934590';
        const message = `*New Contact Form Submission*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Subject:* ${formData.subject}\n\n*Message:*\n${formData.message}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        toast.success('Redirecting to WhatsApp...');

        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        });
    };

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="contact-hero">
                <div className="container">
                    <h1 className="contact-hero-title">
                        Get in <span className="gradient-text">Touch</span>
                    </h1>
                    <p className="contact-hero-subtitle">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="contact-content section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Information */}
                        <div className="contact-info">
                            <h2>Contact Information</h2>
                            <p className="contact-info-subtitle">
                                Reach out to us through any of these channels
                            </p>

                            <div className="contact-details">
                                <div className="contact-detail-item">
                                    <div className="contact-detail-icon">
                                        <FaEnvelope />
                                    </div>
                                    <div className="contact-detail-text">
                                        <h3>Email</h3>
                                        <a href="mailto:dishadeshmukh2004@gmail.com">dishadeshmukh2004@gmail.com</a>
                                    </div>
                                </div>

                                <div className="contact-detail-item">
                                    <div className="contact-detail-icon">
                                        <FaPhone />
                                    </div>
                                    <div className="contact-detail-text">
                                        <h3>Phone</h3>
                                        <a href="tel:+919604934590">+91 9604934590</a>
                                    </div>
                                </div>

                                <div className="contact-detail-item">
                                    <div className="contact-detail-icon">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div className="contact-detail-text">
                                        <h3>Address</h3>
                                        <p>123 Jewelry Street<br />Mumbai, India</p>
                                    </div>
                                </div>

                                <div className="contact-detail-item">
                                    <div className="contact-detail-icon">
                                        <FaWhatsapp />
                                    </div>
                                    <div className="contact-detail-text">
                                        <h3>WhatsApp</h3>
                                        <a href="https://wa.me/9604934590" target="_blank" rel="noopener noreferrer">
                                            Chat with us
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="contact-social">
                                <h3>Follow Us</h3>
                                <div className="social-links">
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <FaFacebook />
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
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
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-container">
                            <h2>Send us a Message</h2>
                            <p className="contact-form-subtitle">
                                Fill out the form below and we'll get back to you shortly
                            </p>

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="form-input"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone" className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            className="form-input"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 9604934590"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject" className="form-label">Subject *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        className="form-input"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="What is this regarding?"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message" className="form-label">Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        className="form-textarea"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="Tell us more about your inquiry..."
                                        rows="6"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary btn-block">
                                    <FaWhatsapp /> Send via WhatsApp
                                </button>

                                <p className="contact-form-note">
                                    * Required fields. Your message will be sent via WhatsApp for faster response.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Business Hours */}
            <section className="contact-hours section">
                <div className="container">
                    <div className="hours-content">
                        <h2>Business Hours</h2>
                        <div className="hours-grid">
                            <div className="hours-item">
                                <span className="hours-day">Monday - Friday</span>
                                <span className="hours-time">10:00 AM - 8:00 PM</span>
                            </div>
                            <div className="hours-item">
                                <span className="hours-day">Saturday</span>
                                <span className="hours-time">10:00 AM - 6:00 PM</span>
                            </div>
                            <div className="hours-item">
                                <span className="hours-day">Sunday</span>
                                <span className="hours-time">Closed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
