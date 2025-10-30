import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User API
export const userAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Stock API
export const stockAPI = {
  getAll: (params) => api.get('/stocks', { params }),
  getBySymbol: (symbol) => api.get(`/stocks/${symbol}`),
  search: (query) => api.get(`/stocks/search/${query}`),
  getBatch: (symbols) => api.post('/stocks/batch', { symbols }),
  getSectors: () => api.get('/stocks/sectors/list'),
};

// Portfolio API
export const portfolioAPI = {
  optimize: (data) => api.post('/portfolio/optimize', data),
  getAll: (params) => api.get('/portfolio', { params }),
  getById: (id) => api.get(`/portfolio/${id}`),
  update: (id, data) => api.put(`/portfolio/${id}`, data),
  delete: (id) => api.delete(`/portfolio/${id}`),
  getStats: (id) => api.get(`/portfolio/${id}/stats`),
};

export default api;
