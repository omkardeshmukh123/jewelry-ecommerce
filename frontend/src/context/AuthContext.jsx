import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('drisora_user'));
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const saveAuth = (token, userData) => {
    localStorage.setItem('drisora_token', token);
    localStorage.setItem('drisora_user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      saveAuth(data.token, data.user);
      toast.success('Account created! Welcome to Drisora.');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      saveAuth(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (credential) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/google', { credential });
      saveAuth(data.token, data.user);
      toast.success(`Welcome, ${data.user.name}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Google login failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', profileData);
      localStorage.setItem('drisora_user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('drisora_token');
    localStorage.removeItem('drisora_user');
    setUser(null);
    toast.success('Signed out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, googleLogin, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
