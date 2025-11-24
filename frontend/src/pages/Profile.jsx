import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(formData);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: user?.address || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <h1 className="profile-title">
                        My <span className="gradient-text">Profile</span>
                    </h1>
                    <p className="profile-subtitle">Manage your account information</p>
                </div>

                <div className="profile-content">
                    <div className="profile-card">
                        <div className="profile-avatar">
                            <FaUser />
                        </div>

                        {!isEditing ? (
                            <div className="profile-info">
                                <div className="info-item">
                                    <FaUser className="info-icon" />
                                    <div>
                                        <label>Full Name</label>
                                        <p>{user?.name || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <FaEnvelope className="info-icon" />
                                    <div>
                                        <label>Email Address</label>
                                        <p>{user?.email || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <FaPhone className="info-icon" />
                                    <div>
                                        <label>Phone Number</label>
                                        <p>{user?.phone || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <FaMapMarkerAlt className="info-icon" />
                                    <div>
                                        <label>Address</label>
                                        <p>{user?.address || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <FaUser className="info-icon" />
                                    <div>
                                        <label>Account Type</label>
                                        <p className="role-badge">{user?.role || 'user'}</p>
                                    </div>
                                </div>

                                <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                                    <FaEdit /> Edit Profile
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="profile-form">
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone" className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 9604934590"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        className="form-textarea"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Enter your full address"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                    <button type="button" onClick={handleCancel} className="btn btn-outline">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
