import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Award, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';

const CATEGORIES = [
  { name: 'Rings',     image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80' },
  { name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80' },
  { name: 'Earrings',  image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80' },
  { name: 'Bracelets', image: 'https://images.unsplash.com/photo-1573408301185-9519f94816f7?w=400&q=80' },
  { name: 'Bangles',   image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80' },
  { name: 'Pendants',  image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80' },
];

const WHY_US = [
  {
    Icon: Shield,
    title: 'Certified Authenticity',
    desc: 'Every piece comes with a BIS hallmark certificate guaranteeing purity and craftsmanship.',
  },
  {
    Icon: Truck,
    title: 'Free Insured Shipping',
    desc: 'Complimentary shipping with full insurance on every order, delivered safely to your door.',
  },
  {
    Icon: Award,
    title: 'Premium Craftsmanship',
    desc: 'Master artisans with decades of experience create each piece with unparalleled precision.',
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    document.title = 'Drisora — Luxury Handcrafted Jewellery';
    api.get('/products/featured')
      .then(res => setFeatured(res.data.products || res.data || []))
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));
  }, []);

  return (
    <main className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__overlay" />
        <div className="container hero__content">
          <p className="label-caps text-gold hero__eyebrow animate-fade-up">Handcrafted Luxury</p>
          <h1 className="display-lg hero__heading animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Timeless Elegance,<br />
            <span className="text-gold-gradient">Crafted in Gold</span>
          </h1>
          <p className="hero__sub animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Discover our exclusive collection of handcrafted luxury jewellery —<br />
            each piece a story of artistry and devotion.
          </p>
          <div className="hero__ctas animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/collections" className="btn btn-primary btn-lg">
              Explore Collections <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-outline btn-lg">Our Story</Link>
          </div>
        </div>
        <div className="hero__scroll-hint">
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section container">
        <div className="section-header">
          <p className="label-caps text-gold">Browse By</p>
          <h2 className="headline-lg">Shop By Category</h2>
          <Link to="/collections" className="section-header__link">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/collections?category=${cat.name}`}
              className="category-card"
            >
              <img src={cat.image} alt={cat.name} className="category-card__img"
                onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80'; }}
              />
              <div className="category-card__overlay" />
              <span className="category-card__name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <p className="label-caps text-gold">Curated For You</p>
            <h2 className="headline-lg">Featured Collection</h2>
            <Link to="/collections?featured=true" className="section-header__link">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 380, borderRadius: 'var(--radius-lg)' }} />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="products-grid">
              {featured.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <p className="text-muted">No featured products yet. Check back soon!</p>
              <Link to="/collections" className="btn btn-outline">Browse All Products</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="section why-section">
        <div className="container">
          <div className="section-header section-header--center">
            <p className="label-caps text-gold">The Drisora Promise</p>
            <h2 className="headline-lg">Why Choose Us</h2>
          </div>
          <div className="why-grid">
            {WHY_US.map(({ Icon, title, desc }) => (
              <div key={title} className="why-card card-glass">
                <div className="why-card__icon">
                  <Icon size={28} />
                </div>
                <h3 className="why-card__title headline-sm">{title}</h3>
                <p className="why-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner container">
        <div className="cta-banner__inner card-glass">
          <div>
            <p className="label-caps text-gold">New Arrivals</p>
            <h2 className="headline-md" style={{ marginTop: 8 }}>
              Discover the Latest Collection
            </h2>
            <p className="text-muted" style={{ marginTop: 8, fontSize: '0.9375rem' }}>
              Fresh designs added weekly — be the first to adorn yourself.
            </p>
          </div>
          <Link to="/collections" className="btn btn-primary btn-lg">
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
