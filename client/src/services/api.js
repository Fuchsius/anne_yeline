import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network errors (ECONNREFUSED, ECONNABORTED, etc.)
    if (error.code === 'ECONNABORTED' || !error.response) {
      // Instead of throwing a generic error, provide more context
      return Promise.reject({
        isServerError: true,
        message: 'Unable to connect to server. Please check your internet connection or try again later.'
      });
    }
    
    return Promise.reject(error);
  }
);

export default api; 