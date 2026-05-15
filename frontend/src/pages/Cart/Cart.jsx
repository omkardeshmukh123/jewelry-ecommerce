import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import './Cart.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [promo, setPromo]       = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkoutForm, setCheckoutForm] = useState({
    name: user?.name || '', email: user?.email || '',
    phone: user?.phone || '', street: '', city: '',
    state: '', zipCode: '', country: 'India', notes: '',
  });
  const [placingOrder, setPlacingOrder] = useState(false);

  const TAX_RATE    = 0.03; // 3% GST shown
  const tax         = subtotal * TAX_RATE;
  const shipping    = subtotal > 5000 ? 0 : 299;
  const discounted  = subtotal - discount;
  const total       = discounted + tax + shipping;

  const applyPromo = () => {
    if (promo.toUpperCase() === 'DRISORA10') {
      setDiscount(subtotal * 0.1);
      toast.success('10% discount applied!');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to place an order'); navigate('/auth'); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    setPlacingOrder(true);
    try {
      const orderItems = items.map(i => ({
        product:  i._id,
        name:     i.name,
        quantity: i.quantity,
        price:    i.finalPrice ?? i.price,
        image:    i.images?.[0] || '',
      }));

      await api.post('/orders', {
        items:        orderItems,
        totalAmount:  total,
        customerInfo: {
          name:    checkoutForm.name,
          email:   checkoutForm.email,
          phone:   checkoutForm.phone,
          address: {
            street:  checkoutForm.street,
            city:    checkoutForm.city,
            state:   checkoutForm.state,
            zipCode: checkoutForm.zipCode,
            country: checkoutForm.country,
          },
        },
        notes: checkoutForm.notes,
      });

      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setPlacingOrder(false); }
  };

  if (items.length === 0) return (
    <div className="cart-empty">
      <div className="cart-empty__inner">
        <ShoppingBag size={64} className="text-gold" />
        <h2 className="headline-md">Your Cart is Empty</h2>
        <p className="text-muted">Add some exquisite pieces to your collection.</p>
        <Link to="/collections" className="btn btn-primary btn-lg">
          Explore Collections <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Your Cart <span className="text-dim">({items.length})</span></h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item._id} className="cart-item card">
                <Link to={`/products/${item._id}`} className="cart-item__image">
                  <img
                    src={item.images?.[0] || PLACEHOLDER}
                    alt={item.name}
                    onError={e => { e.currentTarget.src = PLACEHOLDER; }}
                  />
                </Link>
                <div className="cart-item__details">
                  <Link to={`/products/${item._id}`} className="cart-item__name">{item.name}</Link>
                  <div className="cart-item__meta">
                    <span className="badge badge-secondary">{item.material}</span>
                    {item.purity && <span className="text-dim" style={{ fontSize: '0.8125rem' }}>{item.purity}</span>}
                  </div>
                  <div className="cart-item__bottom">
                    <div className="pd-qty">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><Minus size={13} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><Plus size={13} /></button>
                    </div>
                    <span className="cart-item__price text-gold">
                      ₹{((item.finalPrice ?? item.price) * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button className="cart-item__remove" onClick={() => removeFromCart(item._id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/collections" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }}>
              ← Continue Shopping
            </Link>
          </div>

          {/* Summary + Checkout */}
          <div className="cart-right">
            {/* Order Summary */}
            <div className="card cart-summary">
              <h3 className="headline-sm">Order Summary</h3>
              <div className="cart-summary__rows">
                <div className="cart-summary__row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="cart-summary__row cart-summary__row--discount">
                    <span>Discount</span>
                    <span>−₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="cart-summary__row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="badge badge-success">FREE</span> : `₹${shipping}`}</span>
                </div>
                <div className="cart-summary__row">
                  <span>GST (3%)</span>
                  <span>₹{Math.round(tax).toLocaleString('en-IN')}</span>
                </div>
                <div className="cart-summary__divider" />
                <div className="cart-summary__row cart-summary__row--total">
                  <span>Total</span>
                  <span className="text-gold">₹{Math.round(total).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Promo */}
              <div className="cart-promo">
                <div className="cart-promo__input">
                  <Tag size={15} className="text-dim" />
                  <input
                    className="form-input"
                    placeholder="Promo code"
                    value={promo}
                    onChange={e => setPromo(e.target.value)}
                    style={{ border: 'none', background: 'transparent', padding: '8px 0' }}
                  />
                </div>
                <button className="btn btn-outline btn-sm" onClick={applyPromo}>Apply</button>
              </div>

              <div className="cart-secure">
                <Lock size={13} /> Secure Checkout
              </div>
            </div>

            {/* Checkout form */}
            <form className="card cart-checkout" onSubmit={handlePlaceOrder}>
              <h3 className="headline-sm">Delivery Information</h3>
              <div className="checkout-grid">
                {[
                  { key:'name',    label:'Full Name',    type:'text',  required:true  },
                  { key:'email',   label:'Email',        type:'email', required:true  },
                  { key:'phone',   label:'Phone Number', type:'tel',   required:true  },
                  { key:'street',  label:'Street Address',type:'text', required:true, full:true },
                  { key:'city',    label:'City',         type:'text',  required:true  },
                  { key:'state',   label:'State',        type:'text',  required:true  },
                  { key:'zipCode', label:'PIN Code',     type:'text',  required:true  },
                  { key:'country', label:'Country',      type:'text',  required:true  },
                ].map(({ key, label, type, required, full }) => (
                  <div key={key} className={`form-group ${full ? 'checkout-full' : ''}`}>
                    <label className="form-label">{label}</label>
                    <input
                      type={type}
                      className="form-input"
                      value={checkoutForm[key]}
                      onChange={e => setCheckoutForm(f => ({ ...f, [key]: e.target.value }))}
                      required={required}
                    />
                  </div>
                ))}
                <div className="form-group checkout-full">
                  <label className="form-label">Order Notes (optional)</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Any special instructions..."
                    value={checkoutForm.notes}
                    onChange={e => setCheckoutForm(f => ({ ...f, notes: e.target.value }))}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={placingOrder}>
                {placingOrder ? 'Placing Order...' : `Place Order — ₹${Math.round(total).toLocaleString('en-IN')}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
