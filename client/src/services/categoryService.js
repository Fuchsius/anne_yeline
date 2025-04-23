import { API_ROUTES } from '../constants/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await fetch(API_ROUTES.CATEGORIES.ALL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      throw error;
    }
  },
  
  getCategoryById: async (id) => {
    try {
      const response = await fetch(API_ROUTES.CATEGORIES.SINGLE(id));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch category: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error getting category ${id}:`, error);
      throw error;
    }
  },
  
  createCategory: async (formData) => {
    try {
      const data = new FormData();
      data.append('name', formData.name);
      
      if (formData.description) {
        data.append('description', formData.description);
      }
      
      if (formData.image) {
        data.append('image', formData.image);
      }
      
      const headers = getAuthHeaders();
      
      const response = await fetch(API_ROUTES.CATEGORIES.CREATE, {
        method: 'POST',
        headers: headers,
        body: data,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create category');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },
  
  updateCategory: async (id, formData) => {
    try {
      const data = new FormData();
      data.append('name', formData.name);
      
      if (formData.description) {
        data.append('description', formData.description);
      }
      
      if (formData.image) {
        data.append('image', formData.image);
      }
      
      const response = await fetch(API_ROUTES.CATEGORIES.UPDATE(id), {
        method: 'PUT',
        body: data,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update category');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },
  
  deleteCategory: async (id) => {
    try {
      const response = await fetch(API_ROUTES.CATEGORIES.DELETE(id), {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },
  
  deleteCategoryImage: async (id) => {
    try {
      const response = await fetch(API_ROUTES.CATEGORIES.DELETE_IMAGE(id), {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category image');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error deleting category image ${id}:`, error);
      throw error;
    }
  }
}; 