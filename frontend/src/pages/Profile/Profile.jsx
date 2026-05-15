import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Lock, LogOut } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Profile.css';

const STATUS_BADGE = {
  pending:    'badge-warning',
  confirmed:  'badge-info',
  processing: 'badge-info',
  shipped:    'badge-info',
  delivered:  'badge-success',
  cancelled:  'badge-error',
};

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name:    user?.name  || '',
    phone:   user?.phone || '',
    street:  user?.address?.street  || '',
    city:    user?.address?.city    || '',
    state:   user?.address?.state   || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    document.title = 'My Account — Drisora';
  }, [user]);

  useEffect(() => {
    if (tab === 'orders') {
      setLoadingOrders(true);
      api.get('/orders')
        .then(r => setOrders(r.data.orders || r.data || []))
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [tab]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      name:  profileForm.name,
      phone: profileForm.phone,
      address: {
        street:  profileForm.street,
        city:    profileForm.city,
        state:   profileForm.state,
        zipCode: profileForm.zipCode,
        country: profileForm.country,
      },
    });
    setSaving(false);
  };

  const handlePwSave = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords don\'t match'); return; }
    setSaving(true);
    try {
      await api.put('/auth/profile', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password updated!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally { setSaving(false); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const TABS = [
    { id: 'profile', label: 'My Profile',   Icon: User    },
    { id: 'orders',  label: 'My Orders',    Icon: Package  },
    { id: 'address', label: 'Address',      Icon: MapPin   },
    { id: 'security',label: 'Security',     Icon: Lock     },
  ];

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="container profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar card">
          <div className="profile-sidebar__user">
            <div className="profile-sidebar__avatar">
              {user.profilePicture
                ? <img src={user.profilePicture} alt={user.name} />
                : <span>{user.name?.[0]?.toUpperCase()}</span>
              }
            </div>
            <div>
              <p className="profile-sidebar__name">{user.name}</p>
              <p className="profile-sidebar__email text-dim">{user.email}</p>
              {user.role === 'admin' && <span className="badge badge-gold" style={{ marginTop: 6 }}>Admin</span>}
            </div>
          </div>
          <nav className="profile-nav">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`profile-nav__item ${tab === id ? 'active' : ''}`}
                onClick={() => setTab(id)}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
            {user.role === 'admin' && (
              <button className="profile-nav__item profile-nav__item--gold" onClick={() => navigate('/admin')}>
                ⚙ Admin Panel
              </button>
            )}
            <button className="profile-nav__item profile-nav__item--danger" onClick={handleLogout}>
              <LogOut size={16} /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className="profile-content">

          {/* Profile tab */}
          {tab === 'profile' && (
            <div className="card profile-card">
              <h2 className="headline-sm">Personal Information</h2>
              <form onSubmit={handleProfileSave} className="profile-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={profileForm.name}
                    onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" value={user.email} disabled style={{ opacity: 0.6 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" value={profileForm.phone}
                    onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Orders tab */}
          {tab === 'orders' && (
            <div className="card profile-card">
              <h2 className="headline-sm">My Orders</h2>
              {loadingOrders ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                  <div className="spinner" />
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <Package size={40} className="text-dim" />
                  <p className="text-muted">No orders yet</p>
                </div>
              ) : (
                <div className="orders-table">
                  <div className="orders-table__head">
                    <span>Order ID</span><span>Date</span><span>Items</span><span>Total</span><span>Status</span>
                  </div>
                  {orders.map(order => (
                    <div key={order._id} className="orders-table__row">
                      <span className="text-gold" style={{ fontSize: '0.8125rem' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.8125rem' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.8125rem' }}>
                        {order.items?.length} item(s)
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </span>
                      <span className={`badge ${STATUS_BADGE[order.status] || 'badge-secondary'}`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Address tab */}
          {tab === 'address' && (
            <div className="card profile-card">
              <h2 className="headline-sm">Address Book</h2>
              <form onSubmit={handleProfileSave} className="profile-form profile-form--grid">
                {[
                  { key:'street',  label:'Street Address', full:true },
                  { key:'city',    label:'City' },
                  { key:'state',   label:'State' },
                  { key:'zipCode', label:'PIN Code' },
                  { key:'country', label:'Country' },
                ].map(({ key, label, full }) => (
                  <div key={key} className={`form-group ${full ? 'checkout-full' : ''}`}>
                    <label className="form-label">{label}</label>
                    <input className="form-input" value={profileForm[key]}
                      onChange={e => setProfileForm(f => ({ ...f, [key]: e.target.value }))} />
                  </div>
                ))}
                <button type="submit" className="btn btn-primary checkout-full" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Address'}
                </button>
              </form>
            </div>
          )}

          {/* Security tab */}
          {tab === 'security' && (
            <div className="card profile-card">
              <h2 className="headline-sm">Change Password</h2>
              <form onSubmit={handlePwSave} className="profile-form">
                {[
                  { key:'currentPassword', label:'Current Password' },
                  { key:'newPassword',     label:'New Password'     },
                  { key:'confirm',         label:'Confirm New Password' },
                ].map(({ key, label }) => (
                  <div key={key} className="form-group">
                    <label className="form-label">{label}</label>
                    <input type="password" className="form-input" value={pwForm[key]}
                      onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))} required />
                  </div>
                ))}
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
