import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, LogOut, Settings, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Collections', to: '/collections' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">DRISORA</span>
          <span className="navbar__logo-dot" />
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__nav">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
              end={to === '/'}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          {/* Cart */}
          <Link to="/cart" className="navbar__icon-btn" aria-label="Cart">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="navbar__cart-badge">{totalItems}</span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="navbar__user-menu">
              <button
                className="navbar__icon-btn"
                onClick={() => setDropdownOpen(o => !o)}
                aria-label="Account"
              >
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="navbar__avatar" />
                ) : (
                  <User size={20} />
                )}
              </button>

              {dropdownOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <p className="navbar__dropdown-name">{user.name}</p>
                    <p className="navbar__dropdown-email">{user.email}</p>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  <Link
                    to="/profile"
                    className="navbar__dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings size={15} /> My Account
                  </Link>
                  <Link
                    to="/orders"
                    className="navbar__dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Package size={15} /> My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="navbar__dropdown-item navbar__dropdown-item--gold"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings size={15} /> Admin Panel
                    </Link>
                  )}
                  <div className="navbar__dropdown-divider" />
                  <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="btn btn-outline btn-sm">
              Sign In
            </Link>
          )}

          {/* Mobile burger */}
          <button
            className="navbar__burger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
              end={to === '/'}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
