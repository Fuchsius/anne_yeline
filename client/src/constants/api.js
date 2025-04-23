// Base API URL from environment variables
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API = {
  BASE: BASE_URL,
  // Auth endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/users/login`,
    REGISTER: `${BASE_URL}/users/register`,
    VERIFY_TOKEN: `${BASE_URL}/users/verify-token`,
  },
  // Product endpoints
  PRODUCTS: {
    ALL: `${BASE_URL}/products`,
    SINGLE: (id) => `${BASE_URL}/products/${id}`,
    BY_CATEGORY: (id) => `${BASE_URL}/products/category/${id}`,
    SEARCH: `${BASE_URL}/products/search`,
    REVIEWS: (id) => `${BASE_URL}/products/reviews/${id}`,
  },
  // Category endpoints
  CATEGORIES: {
    ALL: `${BASE_URL}/categories`,
    SINGLE: (id) => `${BASE_URL}/categories/${id}`,
    CREATE: `${BASE_URL}/categories`,
    UPDATE: (id) => `${BASE_URL}/categories/${id}`,
    DELETE: (id) => `${BASE_URL}/categories/delete/${id}`
  },
  // User endpoints
  USER: {
    PROFILE: `${BASE_URL}/users/profile`,
    ADDRESSES: `${BASE_URL}/users/addresses`,
  },
  // Contact endpoints
  CONTACT: {
    SUBMIT: `${BASE_URL}/contact`,
  },
  ORDERS: {
    CREATE: `${BASE_URL}/orders`,
    USER: `${BASE_URL}/orders/user`,
    RECEIPT: (orderId) => `${BASE_URL}/orders/receipt/${orderId}`,
  },
};

export const API_ROUTES = {
  CATEGORIES: {
    ALL: `${BASE_URL}/categories`,
    SINGLE: (id) => `${BASE_URL}/categories/${id}`,
    CREATE: `${BASE_URL}/categories`,
    UPDATE: (id) => `${BASE_URL}/categories/${id}`,
    DELETE: (id) => `${BASE_URL}/categories/delete/${id}`,
    DELETE_IMAGE: (id) => `${BASE_URL}/categories/delete/image/${id}`
  },
  
  PRODUCTS: {
    ALL: `${BASE_URL}/products`,
    SINGLE: (id) => `${BASE_URL}/products/${id}`,
    CREATE: `${BASE_URL}/products`,
    UPDATE: (id) => `${BASE_URL}/products/update/${id}`,
    DELETE: (id) => `${BASE_URL}/products/delete/${id}`,
    SEARCH: `${BASE_URL}/products/search`,
    UPLOAD_IMAGES: (id) => `${BASE_URL}/products/${id}/images`,
    DELETE_IMAGE: (id) => `${BASE_URL}/products/images/${id}`
  },
  
  ORDERS: {
    ALL: `${BASE_URL}/orders/admin`,
    USER: `${BASE_URL}/orders/user`,
    SINGLE: (id) => `${BASE_URL}/orders/${id}`,
    CREATE: `${BASE_URL}/orders`,
    UPDATE_STATUS: (id) => `${BASE_URL}/orders/${id}/status`,
    RECEIPT: (id) => `${BASE_URL}/orders/receipt/${id}`,
  },
  
  // Add other API endpoints as needed
}; 