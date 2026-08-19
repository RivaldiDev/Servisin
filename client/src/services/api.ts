import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
const baseURL = rawApiUrl ? `${rawApiUrl.replace(/\/$/, '')}/api` : '/api';

export const getAssetUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (path.startsWith('/uploads') && rawApiUrl) {
    return `${rawApiUrl.replace(/\/$/, '')}${path}`;
  }
  return path;
};

const api = axios.create({
  baseURL,
  timeout: 15000,
});

// Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('servisin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Sesi expired
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('servisin_token');
        localStorage.removeItem('servisin_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
