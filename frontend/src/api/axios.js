import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('drisora_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercept 401 → clear auth
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('drisora_token');
      localStorage.removeItem('drisora_user');
    }
    return Promise.reject(err);
  }
);

export default api;
