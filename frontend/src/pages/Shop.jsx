import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import { productService } from '../services/productService';
import { FaSearch } from 'react-icons/fa';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        sort: searchParams.get('sort') || '-createdAt',
    });

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.category) params.category = filters.category;
            if (filters.sort) params.sort = filters.sort;

            const response = await productService.getProducts(params);
            setProducts(response.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        // Update URL params
        const params = {};
        Object.keys(newFilters).forEach(k => {
            if (newFilters[k]) params[k] = newFilters[k];
        });
        setSearchParams(params);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            sort: '-createdAt',
        });
        setSearchParams({});
    };

    return (
        <div className="shop-page">
            <div className="container">
                <h1 className="shop-title">Explore Our Collection</h1>

                {/* Filters */}
                <div className="shop-filters">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search jewelry..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Categories</option>
                        <option value="Rings">Rings</option>
                        <option value="Necklaces">Necklaces</option>
                        <option value="Earrings">Earrings</option>
                        <option value="-price">Price: High to Low</option>
                        <option value="name">Name: A-Z</option>
                    </select>

                    <button onClick={clearFilters} className="btn btn-outline btn-sm">
                        Clear Filters
                    </button>
                </div>

                {/* Products */}
                {loading ? (
                    <Loader />
                ) : products.length > 0 ? (
                    <>
                        <div className="shop-results">
                            <p>{products.length} products found</p>
                        </div>
                        <div className="products-grid">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-products">
                        <p>No products found matching your criteria.</p>
                        <button onClick={clearFilters} className="btn btn-primary">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
