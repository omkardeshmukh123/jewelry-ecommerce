import React from 'react';
import { FaWhatsapp, FaShippingFast, FaHeadset } from 'react-icons/fa';
import './Orders.css';

const Orders = () => {
    const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || '9604934590';

    return (
        <div className="orders-page">
            <div className="container">
                <div className="orders-header">
                    <h1 className="orders-title">
                        Track Your <span className="gradient-text">Order</span>
                    </h1>
                    <p className="orders-subtitle">Information on how to check your order status</p>
                </div>

                <div className="orders-info-card">
                    <div className="info-icon-wrapper">
                        <FaShippingFast className="info-main-icon" />
                    </div>

                    <h2>How to Track Your Order</h2>

                    <p className="info-description">
                        To track your order, please message us on WhatsApp with your name and phone number.
                        Our team will verify your details and update you on the current status of your shipment immediately.
                    </p>

                    <div className="steps-container">
                        <div className="step-item">
                            <span className="step-number">1</span>
                            <p>Click the button below to open WhatsApp</p>
                        </div>
                        <div className="step-item">
                            <span className="step-number">2</span>
                            <p>Send us your Name and Phone Number</p>
                        </div>
                        <div className="step-item">
                            <span className="step-number">3</span>
                            <p>Receive instant update on your order status</p>
                        </div>
                    </div>

                    <a
                        href={`https://wa.me/${whatsappNumber}?text=Hi,%20I%20would%20like%20to%20track%20my%20order.%20My%20details%20are:`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary whatsapp-track-btn"
                    >
                        <FaWhatsapp /> Message on WhatsApp
                    </a>

                    <div className="support-note">
                        <FaHeadset />
                        <p>Need help? Our support team is available Mon-Sat, 10 AM - 7 PM</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
