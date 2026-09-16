import axios from 'axios';

/**
 * Axios instance preconfigured for future Node.js / Express backend
 */
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Authorization Bearer token when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tripledger_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
