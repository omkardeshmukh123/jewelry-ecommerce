import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingCart, Heart, Share2, Shield, Truck, Award,
  ChevronLeft, ChevronRight, Star, ThumbsUp, Plus, Minus
} from 'lucide-react';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating/StarRating';
import ProductCard from '../../components/ProductCard/ProductCard';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct]     = useState(null);
  const [related, setRelated]     = useState([]);
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty]             = useState(1);

  // Review form
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [myReview, setMyReview]     = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setLoading(true);
    setActiveImg(0);
    setQty(1);

    Promise.all([
      api.get(`/products/${id}`),
      api.get(`/products/${id}/reviews`),
    ])
      .then(([prodRes, revRes]) => {
        const p = prodRes.data.product || prodRes.data;
        setProduct(p);
        setReviews(revRes.data.reviews || revRes.data || []);
        document.title = `${p.name} — Drisora`;

        // Fetch related
        api.get('/products', { params: { category: p.category, limit: 4 } })
          .then(r => setRelated((r.data.products || r.data || []).filter(x => x._id !== id)));
      })
      .catch(() => navigate('/collections'))
      .finally(() => setLoading(false));

    // My review
    if (user) {
      api.get(`/products/${id}/reviews/my-review`)
        .then(r => setMyReview(r.data.review || null))
        .catch(() => {});
    }
  }, [id, user]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity: qty }, qty);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to leave a review'); return; }
    setSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, reviewForm);
      toast.success('Review submitted!');
      const r = await api.get(`/products/${id}/reviews`);
      setReviews(r.data.reviews || r.data || []);
      setReviewForm({ rating: 5, title: '', comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  const handleHelpful = async (reviewId) => {
    if (!user) { toast.error('Please sign in'); return; }
    try {
      await api.put(`/products/${id}/reviews/${reviewId}/helpful`);
      const r = await api.get(`/products/${id}/reviews`);
      setReviews(r.data.reviews || r.data || []);
    } catch {}
  };

  if (loading) return (
    <div style={{ paddingTop: 120, display: 'flex', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 48, height: 48 }} />
    </div>
  );

  if (!product) return null;

  const images = product.images?.length ? product.images : [PLACEHOLDER];
  const displayPrice = product.finalPrice ?? product.price;

  return (
    <div className="pd-page">
      {/* Breadcrumb */}
      <div className="container pd-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/collections">Collections</Link>
        <span>/</span>
        <Link to={`/collections?category=${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span className="text-muted">{product.name}</span>
      </div>

      {/* Main detail */}
      <div className="container pd-main">
        {/* Images */}
        <div className="pd-images">
          <div className="pd-images__main">
            <img
              src={images[activeImg]}
              alt={product.name}
              className="pd-images__hero"
              onError={e => { e.currentTarget.src = PLACEHOLDER; }}
            />
            {images.length > 1 && (
              <>
                <button className="pd-images__nav pd-images__nav--prev"
                  onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}>
                  <ChevronLeft size={20} />
                </button>
                <button className="pd-images__nav pd-images__nav--next"
                  onClick={() => setActiveImg(i => (i + 1) % images.length)}>
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="pd-images__thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pd-images__thumb ${i === activeImg ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt="" onError={e => { e.currentTarget.src = PLACEHOLDER; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pd-info">
          <div className="pd-info__meta">
            <span className="badge badge-gold label-caps">{product.category}</span>
            {product.featured && <span className="badge badge-warning">Featured</span>}
          </div>

          <h1 className="pd-info__name">{product.name}</h1>

          {product.avgRating > 0 && (
            <div className="pd-info__rating">
              <StarRating rating={product.avgRating} count={product.numReviews} size={16} />
            </div>
          )}

          <div className="pd-info__specs">
            {product.material && <div className="pd-spec"><span>Material</span><span>{product.material}</span></div>}
            {product.purity   && <div className="pd-spec"><span>Purity</span><span>{product.purity}</span></div>}
            {product.weight   && <div className="pd-spec"><span>Weight</span><span>{product.weight}g</span></div>}
          </div>

          <div className="pd-info__pricing">
            <span className="pd-info__price">₹{displayPrice.toLocaleString('en-IN')}</span>
            {product.discount > 0 && (
              <>
                <span className="pd-info__original">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="badge badge-gold">{product.discount}% OFF</span>
              </>
            )}
          </div>

          <p className={`pd-info__stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
            {product.stock > 5 ? '✓ In Stock' : product.stock > 0 ? `⚡ Only ${product.stock} left` : '✗ Out of Stock'}
          </p>

          {/* Qty + Cart */}
          {product.stock > 0 && (
            <div className="pd-info__actions">
              <div className="pd-qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={15} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}><Plus size={15} /></button>
              </div>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleAddToCart}>
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button className="btn btn-outline pd-wishlist-btn" aria-label="Wishlist">
                <Heart size={18} />
              </button>
            </div>
          )}

          {/* Description */}
          <div className="pd-info__desc">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Trust badges */}
          <div className="pd-trust">
            {[
              { Icon: Shield, text: 'BIS Hallmark Certified' },
              { Icon: Truck,  text: 'Free Insured Shipping' },
              { Icon: Award,  text: 'Authenticity Guaranteed' },
            ].map(({ Icon, text }) => (
              <div key={text} className="pd-trust__item">
                <Icon size={15} className="text-gold" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="container pd-reviews">
        <h2 className="headline-md">Customer Reviews</h2>

        <div className="pd-reviews__layout">
          {/* Summary */}
          <div className="pd-reviews__summary card">
            <div className="pd-reviews__score">
              <span className="pd-reviews__big">{product.avgRating?.toFixed(1) || '—'}</span>
              <div>
                <StarRating rating={product.avgRating} size={18} />
                <p className="text-dim" style={{ fontSize: '0.875rem', marginTop: 4 }}>
                  {product.numReviews} reviews
                </p>
              </div>
            </div>
          </div>

          {/* Review list */}
          <div className="pd-reviews__list">
            {reviews.length === 0 ? (
              <p className="text-muted">No reviews yet. Be the first!</p>
            ) : reviews.map(rev => (
              <div key={rev._id} className="review-card card">
                <div className="review-card__header">
                  <div>
                    <p className="review-card__author">{rev.user?.name || 'Anonymous'}</p>
                    <StarRating rating={rev.rating} size={13} />
                  </div>
                  <span className="text-dim" style={{ fontSize: '0.8125rem' }}>
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {rev.title && <p className="review-card__title">{rev.title}</p>}
                <p className="review-card__body">{rev.comment}</p>
                <button className="btn btn-ghost btn-sm review-card__helpful" onClick={() => handleHelpful(rev._id)}>
                  <ThumbsUp size={13} /> Helpful ({rev.helpfulCount || 0})
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Write review */}
        {user && !myReview && (
          <form className="review-form card" onSubmit={submitReview}>
            <h3 className="headline-sm">Write a Review</h3>
            <div className="form-group">
              <label className="form-label">Rating</label>
              <div className="review-form__stars">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button"
                    className={`review-star ${s <= reviewForm.rating ? 'active' : ''}`}
                    onClick={() => setReviewForm(f => ({ ...f, rating: s }))}>★</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" placeholder="Summary of your review"
                value={reviewForm.title}
                onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Comment</label>
              <textarea className="form-input" rows={4} placeholder="Share your experience..."
                value={reviewForm.comment} required
                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
        {!user && (
          <div className="review-form card" style={{ textAlign: 'center' }}>
            <p className="text-muted">
              <Link to="/auth" className="text-gold">Sign in</Link> to write a review
            </p>
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="container pd-related">
          <h2 className="headline-md">You May Also Like</h2>
          <div className="products-grid-related">
            {related.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
