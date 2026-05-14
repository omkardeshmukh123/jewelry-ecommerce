import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import ImageUploader from './ImageUploader';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Rings',
        material: 'Gold',
        purity: '22K',
        weight: '',
        images: [],
        stock: '',
        discount: '0',
        featured: false,
    });
    const [loading, setLoading] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        if (isAdmin()) {
            fetchProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productService.getProducts({ limit: 100 });
            setProducts(response.products || []);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoadingProducts(false);
        }
    };

    if (!isAdmin()) {
        navigate('/');
        return null;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            material: product.material || 'Gold',
            purity: product.purity || '22K',
            weight: product.weight?.toString() || '',
            // Normalise to [{url, key}] — existing products may just have URL strings
            images: product.images.map((img) =>
                typeof img === 'string' ? { url: img, key: null } : img
            ),
            stock: product.stock.toString(),
            discount: product.discount?.toString() || '0',
            featured: product.featured || false,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: 'Rings',
            material: 'Gold',
            purity: '22K',
            weight: '',
            images: [],
            stock: '',
            discount: '0',
            featured: false,
        });
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            await productService.deleteProduct(productId);
            toast.success('Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Extract plain URLs from [{url, key}] objects
            const imagesArray = formData.images
                .map((img) => (typeof img === 'string' ? img : img.url))
                .filter(Boolean);

            if (imagesArray.length === 0) {
                toast.error('Please upload at least one product image');
                setLoading(false);
                return;
            }

            const productData = {
                ...formData,
                images: imagesArray,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                discount: parseFloat(formData.discount) || 0,
                weight: formData.weight ? parseFloat(formData.weight) : undefined,
            };

            if (editingProduct) {
                await productService.updateProduct(editingProduct._id, productData);
                toast.success('Product updated successfully!');
                setEditingProduct(null);
            } else {
                await productService.createProduct(productData);
                toast.success('Product added successfully!');
            }

            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'Rings',
                material: 'Gold',
                purity: '22K',
                weight: '',
                images: [],
                stock: '',
                discount: '0',
                featured: false,
            });

            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${editingProduct ? 'update' : 'add'} product`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome, {user?.name}</p>
                </div>

                <div className="admin-content">
                    {/* Add/Edit Product Form */}
                    <div className="admin-card">
                        <div className="card-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            {editingProduct && (
                                <button onClick={handleCancelEdit} className="btn-cancel">
                                    <FaTimes /> Cancel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Product Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Gold Diamond Ring"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category" className="form-label">Category *</label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="form-select"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="Rings">Rings</option>
                                        <option value="Necklaces">Necklaces</option>
                                        <option value="Earrings">Earrings</option>
                                        <option value="Bracelets">Bracelets</option>
                                        <option value="Bangles">Bangles</option>
                                        <option value="Pendants">Pendants</option>
                                        <option value="Chains">Chains</option>
                                        <option value="Anklets">Anklets</option>
                                        <option value="Nose Pins">Nose Pins</option>
                                        <option value="Mangalsutra">Mangalsutra</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="material" className="form-label">Material *</label>
                                    <select
                                        id="material"
                                        name="material"
                                        className="form-select"
                                        value={formData.material}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="Gold">Gold</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Platinum">Platinum</option>
                                        <option value="Diamond">Diamond</option>
                                        <option value="Gemstone">Gemstone</option>
                                        <option value="Mixed">Mixed</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="purity" className="form-label">Purity</label>
                                    <select
                                        id="purity"
                                        name="purity"
                                        className="form-select"
                                        value={formData.purity}
                                        onChange={handleChange}
                                    >
                                        <option value="14K">14K</option>
                                        <option value="18K">18K</option>
                                        <option value="22K">22K</option>
                                        <option value="24K">24K</option>
                                        <option value="925 Silver">925 Silver</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="weight" className="form-label">Weight (grams)</label>
                                    <input
                                        type="number"
                                        id="weight"
                                        name="weight"
                                        className="form-input"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description" className="form-label">Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    placeholder="Detailed product description..."
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="price" className="form-label">Price (₹) *</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        className="form-input"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="discount" className="form-label">Discount (%)</label>
                                    <input
                                        type="number"
                                        id="discount"
                                        name="discount"
                                        className="form-input"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="stock" className="form-label">Stock *</label>
                                    <input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        className="form-input"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Product Images * <small>(up to 5, first = main)</small>
                                </label>
                                <ImageUploader
                                    value={formData.images}
                                    onChange={(imgs) => setFormData(prev => ({ ...prev, images: imgs }))}
                                />
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                        className="form-checkbox"
                                    />
                                    <span>Featured Product</span>
                                </label>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                {loading ? (editingProduct ? 'Updating...' : 'Adding...') : (editingProduct ? 'Update Product' : 'Add Product')}
                            </button>
                        </form>
                    </div>

                    {/* Products List */}
                    <div className="admin-card">
                        <h2>Manage Products</h2>

                        {loadingProducts ? (
                            <p>Loading products...</p>
                        ) : products.length === 0 ? (
                            <p className="no-products">No products found. Add your first product above!</p>
                        ) : (
                            <div className="products-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Featured</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product._id}>
                                                <td>
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="product-thumb"
                                                    />
                                                </td>
                                                <td>{product.name}</td>
                                                <td>{product.category}</td>
                                                <td>₹{product.price.toLocaleString()}</td>
                                                <td>{product.stock}</td>
                                                <td>{product.featured ? '✓' : '-'}</td>
                                                <td className="actions">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="btn-edit"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="btn-delete"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
