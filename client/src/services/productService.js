import api from './api';
import { API } from '../constants/api';
import { useBackendStatus } from '../context/BackendStatusProvider';
import { useState, useEffect } from 'react';

export const productService = {
  getAllProducts: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.status}`);
      }
      const data = await response.json();
      
      // Debug log
      console.log("Raw products data from API:", data);
      
      return data;
    } catch (error) {
      console.error("Error in productService.getAllProducts:", error);
      throw error;
    }
  },
  
  getProductById: async (id) => {
    try {
      // Use fetch instead of axios to have more control
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`);
      
      // Log response status for debugging
      console.log(`Product ${id} fetch response status:`, response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `Error ${response.status}: Failed to fetch product`);
      }
      
      const data = await response.json();
      
      // Make sure productImages is always an array
      if (!data.productImages) {
        data.productImages = [];
      }
      
      return data;
    } catch (error) {
      console.error("Error in productService.getProductById:", error);
      throw error;
    }
  },
  
  getProductsByCategory: async (categoryId) => {
    try {
      console.log("Calling API for products by category:", categoryId);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/category/${categoryId}`);
      
      console.log("API response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`Fetched ${data.length} products for category ${categoryId}`);
      
      // Sanitize the products data
      return data.map(product => sanitizeProduct(product)).filter(Boolean);
    } catch (error) {
      console.error("Error in productService.getProductsByCategory:", error);
      throw error;
    }
  },
  
  searchProducts: async (params) => {
    const response = await api.get(API.PRODUCTS.SEARCH, { params });
    return response.data;
  },
  
  createReview: async (productId, reviewData) => {
    const response = await api.post(API.PRODUCTS.REVIEWS(productId), reviewData);
    return response.data;
  },
  
  // Create a new product
  createProduct: async (productData) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Clean up any potentially problematic values before sending
      const cleanedData = { ...productData };
      
      // Ensure weight, discount, and salePrice are numbers or null
      if (cleanedData.weight === '' || cleanedData.weight === undefined) {
        cleanedData.weight = null;
      }
      
      if (cleanedData.discount === '' || cleanedData.discount === undefined) {
        cleanedData.discount = null;
      }
      
      if (cleanedData.salePrice === '' || cleanedData.salePrice === undefined) {
        cleanedData.salePrice = null;
      }
      
      console.log('Sending to API:', cleanedData);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanedData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Product creation error:', error);
      throw error;
    }
  },
  
  // Update product
  updateProduct: async (productId, productData) => {
    try {
      // Clean and format the data
      const formattedData = {
        ...productData,
        // Convert empty strings to null for optional numeric fields
        discount: productData.discount || null,
        salePrice: productData.salePrice || null,
        weight: productData.weight || null,
        // Ensure required numeric fields are numbers
        price: parseFloat(productData.price),
        stockCount: parseInt(productData.stockCount),
        categoryId: parseInt(productData.categoryId)
      };

      console.log('Sending formatted data to backend:', formattedData);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      return await response.json();
    } catch (error) {
      console.error('Product update error:', error);
      throw error;
    }
  },
  
  // Upload product images
  uploadProductImages: async (productId, formData) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      console.log(`Uploading images for product ${productId}`);
      // Debug to see what's in the FormData
      for (let pair of formData.entries()) {
        console.log(`FormData contains: ${pair[0]}, filename: ${pair[1].name}, type: ${pair[1].type}, size: ${pair[1].size}`);
      }
      
      // Make sure we use the exact same URL pattern that's defined in the backend
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      // This should match the route we defined in productsRouter.js
      const uploadUrl = `${baseUrl}/products/${productId}/images`;
      
      console.log('Sending upload request to:', uploadUrl);
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries([...response.headers]));
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // Now parse the JSON (if it's JSON)
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Parsed JSON response:', result);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
      }
      
      return result || { success: false, error: 'Invalid response' };
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  },
  
  // Delete a product image
  deleteProductImage: async (imageId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product image');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Image deletion error:', error);
      throw error;
    }
  },
  
  // Delete a product
  deleteProduct: async (id) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      console.log(`Deleting product with ID: ${id}`);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Log the response for debugging
      console.log('Delete response status:', response.status);
      
      if (!response.ok) {
        // Get the response text to check if it's HTML or JSON
        const responseText = await response.text();
        
        // Check if the response is HTML (starts with <!DOCTYPE or <html)
        if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
          console.error('Received HTML error response instead of JSON');
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        // Try to parse as JSON if it looks like JSON
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || 'Failed to delete product');
        } catch (parseError) {
          // If parsing fails, use the text response as the error message
          throw new Error(`Failed to delete product: ${responseText.substring(0, 100)}...`);
        }
      }
      
      // If the response is OK but empty, return a success object
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true, message: 'Product deleted successfully' };
      }
      
      // Otherwise parse the JSON response
      return await response.json();
    } catch (error) {
      console.error('Product deletion error:', error);
      throw error;
    }
  }
};

const sanitizeProduct = (product) => {
  if (!product) return null;
  
  // Make a copy to avoid mutating the original
  const sanitized = { ...product };
  
  // Ensure category is a string
  if (typeof sanitized.category === 'object' && sanitized.category) {
    sanitized.categoryName = sanitized.category.name || 'Unknown Category';
    // Keep the original for ID reference
    sanitized.categoryId = sanitized.category.id;
  }
  
  // Log the product data for debugging
  console.log("Sanitizing product:", JSON.stringify({
    id: sanitized.id,
    name: sanitized.name,
    hasImages: !!sanitized.images || !!sanitized.productImages || !!sanitized.image
  }));
  
  // Fix image paths if necessary
  if (sanitized.productImages && sanitized.productImages.length > 0) {
    console.log("Found productImages:", sanitized.productImages.length);
    sanitized.productImages = sanitized.productImages.map(img => {
      if (img.imageUrl && img.imageUrl.startsWith('/uploads')) {
        return {
          ...img,
          imageUrl: `${import.meta.env.VITE_API_URL.split('/api')[0]}${img.imageUrl}`
        };
      }
      return img;
    });
  }
  
  // Also handle single image property
  if (sanitized.image && typeof sanitized.image === 'string') {
    console.log("Found single image:", sanitized.image);
    if (sanitized.image.startsWith('/uploads')) {
      sanitized.image = `${import.meta.env.VITE_API_URL.split('/api')[0]}${sanitized.image}`;
    }
  }
  
  return sanitized;
};

// Then wrap your existing methods
const originalGetAllProducts = productService.getAllProducts;
productService.getAllProducts = async () => {
  const products = await originalGetAllProducts();
  
  if (!Array.isArray(products)) {
    console.error('Expected products to be an array but got:', typeof products);
    return [];
  }
  
  const sanitizedProducts = products.map(sanitizeProduct).filter(Boolean);
  console.log(`Sanitized ${sanitizedProducts.length} products from ${products.length} raw products`);
  return sanitizedProducts;
};

const originalGetProductById = productService.getProductById;
productService.getProductById = async (id) => {
  try {
    const product = await originalGetProductById(id);
    
    console.log("API response for product:", id);
    console.log("Has image property:", !!product.image);
    console.log("Has productImages property:", !!product.productImages);
    console.log("Number of product images:", product.productImages?.length || 0);
    
    // Return the sanitized product
    return sanitizeProduct(product);
  } catch (error) {
    console.error("Error in wrapped getProductById:", error);
    throw error;
  }
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendStatus = useBackendStatus();

  useEffect(() => {
    const fetchProducts = async () => {
      // If backend is disconnected, don't even try to fetch
      if (!backendStatus.connected && !backendStatus.checking) {
        setLoading(false);
        setError({ message: 'Server is currently undergoing maintenance' });
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(API.PRODUCTS.ALL);
        setProducts(response.data.map(sanitizeProduct));
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        // Use the custom error message if it's a server error
        setError(err.isServerError 
          ? { message: err.message } 
          : { message: 'Failed to load products. Please try again later.' });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [backendStatus.connected]);

  return { products, loading, error };
}; 