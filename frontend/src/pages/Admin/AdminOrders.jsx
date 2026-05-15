import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending','confirmed','processing','shipped','delivered','cancelled'];
const STATUS_BADGE   = { pending:'badge-warning', confirmed:'badge-info', processing:'badge-info', shipped:'badge-info', delivered:'badge-success', cancelled:'badge-error' };

export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/all');
      setOrders(data.orders || data || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Status updated');
      fetch();
    } catch { toast.error('Failed'); }
  };

  const markWA = async (id) => {
    try { await api.put(`/orders/${id}/whatsapp`); fetch(); } catch {}
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div className="admin-content">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 28 }}>
        <h1 className="admin-heading">Orders <span className="text-dim">({orders.length})</span></h1>
        <select className="form-input" style={{ width:'auto' }} value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="card admin-table-card">
        <div className="admin-orders-table">
          <div className="admin-orders-table__head">
            <span>Order ID</span><span>Customer</span><span>Items</span>
            <span>Amount</span><span>Status</span><span>WhatsApp</span><span>Date</span>
          </div>
          {loading ? [...Array(6)].map((_,i) => (
            <div key={i} className="skeleton" style={{ height:52, borderRadius:0 }} />
          )) : filtered.map(order => (
            <div key={order._id} className="admin-orders-table__row">
              <span className="text-gold" style={{ fontSize:'0.8125rem' }}>#{order._id.slice(-8).toUpperCase()}</span>
              <div>
                <p style={{ fontSize:'0.875rem', fontWeight:500 }}>{order.customerInfo?.name || '—'}</p>
                <p className="text-dim" style={{ fontSize:'0.75rem' }}>{order.customerInfo?.phone}</p>
              </div>
              <span className="text-muted" style={{ fontSize:'0.875rem' }}>{order.items?.length} item(s)</span>
              <span style={{ fontWeight:600 }}>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
              <span>
                <select className="admin-status-select" value={order.status} onChange={e=>updateStatus(order._id, e.target.value)}>
                  {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </span>
              <span>
                {order.whatsappSent
                  ? <span className="badge badge-success">Sent ✓</span>
                  : <button className="btn btn-ghost btn-sm" style={{ color:'#25d366' }} onClick={()=>markWA(order._id)}>WhatsApp</button>
                }
              </span>
              <span className="text-dim" style={{ fontSize:'0.8125rem' }}>
                {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
