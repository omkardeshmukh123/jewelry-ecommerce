import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Star,
  Upload, Settings, LogOut, TrendingUp, MessageSquare
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUpload from './AdminUpload';
import toast from 'react-hot-toast';
import './Admin.css';

const STATUS_BADGE = {
  pending:'badge-warning', confirmed:'badge-info', processing:'badge-info',
  shipped:'badge-info', delivered:'badge-success', cancelled:'badge-error',
};

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    if (user.role !== 'admin') { navigate('/'); toast.error('Admin access required'); return; }
    document.title = 'Admin Panel — Drisora';
    fetchDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/orders/all'),
        api.get('/products', { params: { limit: 5 } }),
      ]);
      const orders = ordersRes.data.orders || ordersRes.data || [];
      setRecentOrders(orders.slice(0, 8));
      const revenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
      const total   = productsRes.data.total || 0;
      setStats({
        revenue,
        totalOrders: orders.length,
        totalProducts: total,
        delivered: orders.filter(o => o.status === 'delivered').length,
        pending:   orders.filter(o => o.status === 'pending').length,
      });
    } catch {}
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchDashboard();
    } catch { toast.error('Failed to update status'); }
  };

  const markWhatsApp = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/whatsapp`);
      toast.success('WhatsApp marked as sent');
      fetchDashboard();
    } catch {}
  };

  const TABS = [
    { id: 'dashboard', label: 'Dashboard',  Icon: LayoutDashboard },
    { id: 'orders',    label: 'Orders',     Icon: ShoppingBag     },
    { id: 'products',  label: 'Products',   Icon: Package         },
    { id: 'upload',    label: 'Upload',     Icon: Upload          },
  ];

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <span>DRISORA</span>
          <span className="badge badge-gold">Admin</span>
        </div>
        <nav className="admin-nav">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} className={`admin-nav__item ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
              <Icon size={17} />{label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">{user.name?.[0]?.toUpperCase()}</div>
            <div>
              <p style={{ fontSize:'0.875rem', fontWeight:500 }}>{user.name}</p>
              <p className="text-dim" style={{ fontSize:'0.75rem' }}>Administrator</p>
            </div>
          </div>
          <button className="admin-nav__item admin-nav__item--danger" onClick={() => { logout(); navigate('/'); }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div className="admin-content">
            <h1 className="admin-heading">Dashboard</h1>

            {/* Stats */}
            <div className="admin-stats">
              {[
                { label:'Total Revenue',   value: stats ? `₹${Math.round(stats.revenue).toLocaleString('en-IN')}` : '—', Icon: TrendingUp, cls:'gold'    },
                { label:'Total Orders',    value: stats?.totalOrders   ?? '—', Icon: ShoppingBag, cls:'info'    },
                { label:'Total Products',  value: stats?.totalProducts ?? '—', Icon: Package,     cls:'default' },
                { label:'Pending Orders',  value: stats?.pending       ?? '—', Icon: MessageSquare, cls:'warn'  },
              ].map(({ label, value, Icon, cls }) => (
                <div key={label} className={`stat-card card stat-card--${cls}`}>
                  <div className="stat-card__icon"><Icon size={22} /></div>
                  <div>
                    <p className="stat-card__value">{value}</p>
                    <p className="stat-card__label">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="card admin-table-card">
              <div className="admin-table-card__header">
                <h3 className="headline-sm">Recent Orders</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setTab('orders')}>View All</button>
              </div>
              <div className="admin-orders-table">
                <div className="admin-orders-table__head">
                  <span>Order ID</span><span>Customer</span><span>Amount</span>
                  <span>Status</span><span>WhatsApp</span><span>Actions</span>
                </div>
                {recentOrders.map(order => (
                  <div key={order._id} className="admin-orders-table__row">
                    <span className="text-gold" style={{ fontSize:'0.8125rem' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span style={{ fontSize:'0.875rem' }}>{order.customerInfo?.name || '—'}</span>
                    <span style={{ fontWeight:500 }}>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                    <span>
                      <select
                        className="admin-status-select"
                        value={order.status}
                        onChange={e => handleStatusUpdate(order._id, e.target.value)}
                      >
                        {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </span>
                    <span>
                      {order.whatsappSent
                        ? <span className="badge badge-success">Sent</span>
                        : <button className="btn btn-ghost btn-sm" onClick={() => markWhatsApp(order._id)}>Mark</button>
                      }
                    </span>
                    <span>
                      <span className={`badge ${STATUS_BADGE[order.status] || 'badge-secondary'}`}>
                        {order.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'orders'   && <AdminOrders />}
        {tab === 'products' && <AdminProducts />}
        {tab === 'upload'   && <AdminUpload />}
      </main>
    </div>
  );
}
