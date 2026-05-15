import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, X, Check } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const CATEGORIES = ['Rings','Necklaces','Earrings','Bracelets','Bangles','Pendants','Chains','Anklets','Nose Pins','Mangalsutra','Other'];
const MATERIALS  = ['Gold','Silver','Platinum','Diamond','Gemstone','Mixed'];
const PURITIES   = ['14K','18K','22K','24K','925 Silver','Other'];
const PLACEHOLDER = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80';

const EMPTY = { name:'', description:'', price:'', category:'Rings', material:'Gold', weight:'', purity:'', stock:'', discount:0, images:[''], featured:false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', { params: { page, limit: 10 } });
      setProducts(data.products || data || []);
      setTotal(data.total || 0);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]);

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (p)  => {
    setForm({ ...p, images: p.images?.length ? p.images : [''] });
    setEditing(p._id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), weight: Number(form.weight) || undefined, discount: Number(form.discount) || 0, images: form.images.filter(Boolean) };
      if (editing) { await api.put(`/products/${editing}`, payload); toast.success('Product updated!'); }
      else          { await api.post('/products', payload);           toast.success('Product created!'); }
      setShowForm(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Deleted'); fetch(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="admin-content">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 28 }}>
        <h1 className="admin-heading">Products <span className="text-dim">({total})</span></h1>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Product</button>
      </div>

      {/* Product table */}
      <div className="card admin-table-card">
        <div className="admin-prod-table">
          <div className="admin-prod-table__head">
            <span>Image</span><span>Name</span><span>Category</span>
            <span>Price</span><span>Stock</span><span>Featured</span><span>Actions</span>
          </div>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 56, borderRadius: 0 }} />
            ))
          ) : products.map(p => (
            <div key={p._id} className="admin-prod-table__row">
              <span>
                <img src={p.images?.[0] || PLACEHOLDER} alt={p.name}
                  style={{ width: 44, height: 44, objectFit:'cover', borderRadius: 'var(--radius-md)' }}
                  onError={e => { e.currentTarget.src = PLACEHOLDER; }} />
              </span>
              <span style={{ fontWeight:500, fontSize:'0.875rem' }}>{p.name}</span>
              <span><span className="badge badge-secondary">{p.category}</span></span>
              <span className="text-gold">₹{p.price?.toLocaleString('en-IN')}</span>
              <span className={p.stock === 0 ? 'badge badge-error' : 'text-muted'}>{p.stock}</span>
              <span>{p.featured ? <Check size={16} className="text-gold" /> : '—'}</span>
              <span style={{ display:'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}><Edit size={14} /></button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}><Trash2 size={14} /></button>
              </span>
            </div>
          ))}
        </div>
        {total > 10 && (
          <div className="collections-pagination" style={{ padding: '16px 0' }}>
            {[...Array(Math.ceil(total/10))].map((_,i) => (
              <button key={i} className={`collections-page-btn ${page===i+1?'active':''}`} onClick={() => setPage(i+1)}>{i+1}</button>
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="headline-sm">{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} className="admin-modal__form">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input className="form-input" required value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-input" rows={3} required value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
              </div>
              <div className="admin-form-grid">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input type="number" className="form-input" required min={0} value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input type="number" className="form-input" required min={0} value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Material *</label>
                  <select className="form-input" value={form.material} onChange={e=>setForm(f=>({...f,material:e.target.value}))}>
                    {MATERIALS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Purity</label>
                  <select className="form-input" value={form.purity} onChange={e=>setForm(f=>({...f,purity:e.target.value}))}>
                    <option value="">— Select —</option>
                    {PURITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (g)</label>
                  <input type="number" className="form-input" min={0} step={0.01} value={form.weight} onChange={e=>setForm(f=>({...f,weight:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
                  <input type="number" className="form-input" min={0} max={100} value={form.discount} onChange={e=>setForm(f=>({...f,discount:e.target.value}))} />
                </div>
                <div className="form-group" style={{ alignSelf:'end' }}>
                  <label className="filter-checkbox">
                    <input type="checkbox" checked={form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))} />
                    <span>Featured Product</span>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Image URLs</label>
                {form.images.map((img, i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
                    <input className="form-input" placeholder="https://..." value={img}
                      onChange={e => { const imgs=[...form.images]; imgs[i]=e.target.value; setForm(f=>({...f,images:imgs})); }} />
                    {form.images.length > 1 && (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm(f=>({...f,images:f.images.filter((_,j)=>j!==i)}))}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm(f=>({...f,images:[...f.images,'']}))}>
                  <Plus size={14} /> Add Image URL
                </button>
              </div>
              <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
