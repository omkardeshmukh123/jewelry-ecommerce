import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Collections.css';

const CATEGORIES = ['Rings','Necklaces','Earrings','Bracelets','Bangles','Pendants','Chains','Anklets','Nose Pins','Mangalsutra','Other'];
const MATERIALS  = ['Gold','Silver','Platinum','Diamond','Gemstone','Mixed'];
const PURITIES   = ['14K','18K','22K','24K','925 Silver','Other'];
const SORT_OPTIONS = [
  { value: '',        label: 'Default' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',  label: 'Top Rated' },
  { value: 'newest',  label: 'Newest First' },
];

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search:   searchParams.get('search')   || '',
    category: searchParams.get('category') || '',
    material: searchParams.get('material') || '',
    purity:   searchParams.get('purity')   || '',
    sort:     searchParams.get('sort')     || '',
    featured: searchParams.get('featured') || '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const { data } = await api.get('/products', { params });
      setProducts(data.products || data || []);
      setTotal(data.total || 0);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => {
    document.title = 'Collections — Drisora Luxury Jewellery';
  }, []);

  const handleFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search:'', category:'', material:'', purity:'', sort:'', featured:'' });
    setPage(1);
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="collections-page">
      <div className="collections-header container">
        <div>
          <p className="label-caps text-gold">Our Collections</p>
          <h1 className="headline-lg" style={{ marginTop: 8 }}>All Jewellery</h1>
          <p className="text-muted" style={{ marginTop: 4, fontSize: '0.9375rem' }}>
            {loading ? '...' : `${total} pieces found`}
          </p>
        </div>
        {/* Mobile filter toggle */}
        <button className="btn btn-outline btn-sm collections-filter-toggle" onClick={() => setSidebarOpen(o => !o)}>
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      <div className={`container collections-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* ── Sidebar ── */}
        <aside className="collections-sidebar card">
          <div className="collections-sidebar__header">
            <h3 className="headline-sm">Filters</h3>
            {hasFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Search */}
          <div className="filter-group">
            <label className="form-label">Search</label>
            <div className="filter-search">
              <Search size={16} className="filter-search__icon" />
              <input
                className="form-input"
                placeholder="Search jewellery..."
                value={filters.search}
                onChange={e => handleFilter('search', e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>

          {/* Category */}
          <div className="filter-group">
            <label className="form-label">Category</label>
            <div className="filter-options">
              {CATEGORIES.map(cat => (
                <label key={cat} className="filter-checkbox">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat}
                    onChange={() => handleFilter('category', filters.category === cat ? '' : cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Material */}
          <div className="filter-group">
            <label className="form-label">Material</label>
            <div className="filter-options">
              {MATERIALS.map(m => (
                <label key={m} className="filter-checkbox">
                  <input
                    type="radio"
                    name="material"
                    checked={filters.material === m}
                    onChange={() => handleFilter('material', filters.material === m ? '' : m)}
                  />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Purity */}
          <div className="filter-group">
            <label className="form-label">Purity</label>
            <div className="filter-options">
              {PURITIES.map(p => (
                <label key={p} className="filter-checkbox">
                  <input
                    type="radio"
                    name="purity"
                    checked={filters.purity === p}
                    onChange={() => handleFilter('purity', filters.purity === p ? '' : p)}
                  />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <label className="form-label">Sort By</label>
            <select
              className="form-input"
              value={filters.sort}
              onChange={e => handleFilter('sort', e.target.value)}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* ── Grid ── */}
        <main className="collections-main">
          {loading ? (
            <div className="products-grid-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 380, borderRadius: 'var(--radius-lg)' }} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="products-grid-3">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {total > 12 && (
                <div className="collections-pagination">
                  {[...Array(Math.ceil(total / 12))].map((_, i) => (
                    <button
                      key={i}
                      className={`collections-page-btn ${page === i + 1 ? 'active' : ''}`}
                      onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ padding: '80px 24px' }}>
              <p className="text-muted">No products found matching your filters.</p>
              <button className="btn btn-outline" onClick={clearFilters}>Clear All Filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
