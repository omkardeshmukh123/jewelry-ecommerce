import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    const handleWhatsAppOrder = () => {
        if (!isAuthenticated()) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }

        const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || '1234567890';
        let message = '🛍️ *New Order from Drisora*\\n\\n';

        cartItems.forEach((item, index) => {
            const price = item.finalPrice || item.price;
            message += `${index + 1}. *${item.name}*\\n`;
            message += `   Product ID: ${item._id}\\n`;
            message += `   Quantity: ${item.quantity}\\n`;
            message += `   Price: ${formatPrice(price * item.quantity)}\\n\\n`;
        });

        message += `*Total Amount: ${formatPrice(getCartTotal())}*\\n\\n`;
        message += 'Please confirm this order. Thank you!';

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        toast.success('Redirecting to WhatsApp...');
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <div className="container">
                    <h2>Your Cart is Empty</h2>
                    <p>Add some beautiful jewelry to your cart!</p>
                    <button onClick={() => navigate('/shop')} className="btn btn-primary">
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="cart-title">Shopping Cart</h1>

                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => {
                            const price = item.finalPrice || item.price;
                            return (
                                <div key={item._id} className="cart-item">
                                    <img src={item.images[0]} alt={item.name} className="cart-item-image" />

                                    <div className="cart-item-details">
                                        <h3 className="cart-item-name">{item.name}</h3>
                                        <p className="cart-item-category">{item.category} • {item.material}</p>
                                        <p className="cart-item-price">{formatPrice(price)}</p>
                                    </div>

                                    <div className="cart-item-quantity">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            className="quantity-btn"
                                        >
                                            -
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="quantity-btn"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="cart-item-total">
                                        {formatPrice(price * item.quantity)}
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="cart-item-remove"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary">
                        <h2 className="summary-title">Order Summary</h2>

                        <div className="summary-row">
                            <span>Subtotal ({cartItems.length} items)</span>
                            <span>{formatPrice(getCartTotal())}</span>
                        </div>

                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="text-brand">FREE</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span>{formatPrice(getCartTotal())}</span>
                        </div>

                        <button onClick={handleWhatsAppOrder} className="btn btn-primary btn-block whatsapp-btn">
                            <FaWhatsapp /> Order via WhatsApp
                        </button>

                        <button onClick={clearCart} className="btn btn-outline btn-block">
                            Clear Cart
                        </button>

                        <div className="cart-info">
                            <p>✓ Secure checkout</p>
                            <p>✓ Free shipping on all orders</p>
                            <p>✓ Easy returns within 7 days</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
