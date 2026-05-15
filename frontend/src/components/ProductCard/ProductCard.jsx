import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import StarRating from '../StarRating/StarRating';
import './ProductCard.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80';

const MATERIAL_CLASS = {
  Gold: 'badge-gold',
  Diamond: 'badge-info',
  Platinum: 'badge-secondary',
  Silver: 'badge-secondary',
  Gemstone: 'badge-warning',
  Mixed: 'badge-secondary',
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const {
    _id, name, price, finalPrice, discount,
    category, material, images = [], avgRating = 0, numReviews = 0, stock = 0,
  } = product;

  const displayPrice = finalPrice ?? price;
  const image = images[0] || PLACEHOLDER;

  return (
    <div className="product-card">
      <Link to={`/products/${_id}`} className="product-card__image-wrap">
        <img
          src={image}
          alt={name}
          className="product-card__image"
          onError={e => { e.currentTarget.src = PLACEHOLDER; }}
        />
        {discount > 0 && (
          <span className="product-card__discount-badge">{discount}% OFF</span>
        )}
        {stock === 0 && (
          <div className="product-card__sold-out">Sold Out</div>
        )}
        <button
          className="product-card__wishlist"
          aria-label="Add to wishlist"
          onClick={e => e.preventDefault()}
        >
          <Heart size={16} />
        </button>
      </Link>

      <div className="product-card__body">
        <div className="product-card__meta">
          <span className={`badge ${MATERIAL_CLASS[material] || 'badge-secondary'}`}>
            {material}
          </span>
          <span className="product-card__category text-dim label-caps">{category}</span>
        </div>

        <Link to={`/products/${_id}`} className="product-card__name">{name}</Link>

        {avgRating > 0 && (
          <StarRating rating={avgRating} count={numReviews} size={13} />
        )}

        <div className="product-card__pricing">
          <span className="product-card__price">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
          {discount > 0 && (
            <span className="product-card__original">
              ₹{price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <button
          className="btn btn-primary btn-sm btn-full product-card__add-btn"
          onClick={() => stock > 0 && addToCart(product)}
          disabled={stock === 0}
        >
          <ShoppingCart size={15} />
          {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
