import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone } from 'lucide-react';
import './Footer.css';

const CATEGORIES = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles', 'Pendants'];
const COMPANY    = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Careers', to: '#' },
  { label: 'Press', to: '#' },
];
const SUPPORT    = [
  { label: 'FAQ', to: '#' },
  { label: 'Shipping Policy', to: '#' },
  { label: 'Returns & Exchanges', to: '#' },
  { label: 'Track Order', to: '/orders' },
  { label: 'Privacy Policy', to: '#' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top container">
        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">DRISORA</Link>
          <p className="footer__tagline">
            Where elegance meets eternity. Handcrafted luxury jewellery since 2018.
          </p>
          <div className="footer__socials">
            {[
              { Icon: Instagram, href: '#' },
              { Icon: Facebook, href: '#' },
              { Icon: Twitter, href: '#' },
              { Icon: Youtube, href: '#' },
            ].map(({ Icon, href }, i) => (
              <a key={i} href={href} className="footer__social-icon" aria-label="social">
                <Icon size={18} />
              </a>
            ))}
          </div>
          <div className="footer__contact">
            <a href="mailto:hello@drisora.com" className="footer__contact-link">
              <Mail size={14} /> hello@drisora.com
            </a>
            <a href="tel:+911234567890" className="footer__contact-link">
              <Phone size={14} /> +91 12345 67890
            </a>
          </div>
        </div>

        {/* Collections */}
        <div className="footer__col">
          <h4 className="footer__col-title label-caps">Collections</h4>
          <ul className="footer__links">
            {CATEGORIES.map(cat => (
              <li key={cat}>
                <Link to={`/collections?category=${cat}`} className="footer__link">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="footer__col">
          <h4 className="footer__col-title label-caps">Company</h4>
          <ul className="footer__links">
            {COMPANY.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="footer__link">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="footer__col">
          <h4 className="footer__col-title label-caps">Support</h4>
          <ul className="footer__links">
            {SUPPORT.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="footer__link">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer__divider" />

      <div className="footer__bottom container">
        <p className="footer__copy">
          © {new Date().getFullYear()} Drisora Luxury Jewellery. All rights reserved.
        </p>
        <div className="footer__payment">
          {['BIS', 'Hallmark', 'SSL Secure', 'Free Shipping'].map(tag => (
            <span key={tag} className="badge badge-secondary">{tag}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
