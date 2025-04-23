import { useEffect, useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { API_ROUTES } from '../../constants/api';
import { categoryService } from '../../services/categoryService';
import { ROUTES } from '../../constants/routes';
import { COLORS } from '../../constants/colors';
import { AdminHeader } from '../../components/admin/AdminHeader';

const ApiDebug = ({ visible, requests }) => {
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg max-w-md max-h-80 overflow-auto z-50">
      <h3 className="text-sm font-bold mb-2">API Debug</h3>
      <div className="text-xs">
        {requests.map((req, i) => (
          <div key={i} className="mb-2 pb-2 border-b border-gray-100">
            <div><span className="font-medium">{req.method}</span> {req.url}</div>
            <div className="text-gray-500">{req.status} {req.statusText}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [apiRequests, setApiRequests] = useState([]);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key === 'D') {
        setShowDebug(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const addApiRequest = (request) => {
    setApiRequests(prev => [...prev, request]);
  };

  const fetchCategories = async () => {
    try {
      const startTime = new Date();
      const data = await categoryService.getAllCategories();
      const endTime = new Date();
      
      // Log API request
      addApiRequest({
        method: 'GET',
        url: API_ROUTES.CATEGORIES.ALL,
        status: 200,
        statusText: 'OK',
        duration: endTime - startTime
      });
      
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      
      // Log failed API request
      addApiRequest({
        method: 'GET',
        url: API_ROUTES.CATEGORIES.ALL,
        status: error.response?.status || 0,
        statusText: error.message,
        duration: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, category = null) => {
    setModalMode(mode);
    if (category) {
      setCurrentCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: null
      });
    } else {
      setCurrentCategory(null);
      setFormData({
        name: '',
        description: '',
        image: null
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
      
      // Clear error when field is modified
      if (formErrors.image) {
        setFormErrors({
          ...formErrors,
          image: ''
        });
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Log what we're trying to do
      console.log(`${modalMode === 'add' ? 'Creating' : 'Updating'} category with data:`, formData);
      
      if (modalMode === 'add') {
        // Try with more detailed error logging
        try {
          await categoryService.createCategory(formData);
          console.log('Category created successfully');
        } catch (error) {
          console.error('Category creation failed:', error);
          if (error.response) {
            console.error('Server response:', error.response.data);
          }
          throw error; // Rethrow to be caught by the outer catch
        }
      } else {
        // Edit mode
        try {
          await categoryService.updateCategory(currentCategory.id, formData);
          console.log('Category updated successfully');
        } catch (error) {
          console.error('Category update failed:', error);
          if (error.response) {
            console.error('Server response:', error.response.data);
          }
          throw error; // Rethrow to be caught by the outer catch
        }
      }
      
      // Refresh categories on success
      await fetchCategories();
      setShowModal(false);
      
      // Clean up the image preview URL if it exists
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      alert(`Failed to ${modalMode === 'add' ? 'create' : 'update'} category: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Categories" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* French-inspired header with tricolor accent */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-1.5 rounded-full bg-blue-600 mr-3"></div>
                    <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
                  </div>
                  <div className="flex items-center">
                    <div className="h-1 w-16 flex rounded-full overflow-hidden">
                      <div className="w-1/3 bg-blue-600"></div>
                      <div className="w-1/3 bg-white"></div>
                      <div className="w-1/3 bg-red-600"></div>
                    </div>
                    <p className="ml-3 text-gray-500">
                      Organize your products with elegant categories
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleOpenModal('add')}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>New Category</span>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Categories Content */}
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden p-8">
                <div className="flex justify-center">
                  <div className="relative h-16 w-16">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-transparent animate-spin" 
                      style={{ borderColor: '#2563EB transparent #EF4444 transparent' }}>
                    </div>
                  </div>
                </div>
              </div>
            ) : categories.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-white">
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Products
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 relative rounded-lg bg-gray-100 shadow-sm overflow-hidden border border-gray-200">
                                {category.image ? (
                                  <img 
                                    className="h-12 w-12 object-cover" 
                                    src={`${import.meta.env.VITE_API_URL.split('/api')[0]}/${category.image}`}
                                    alt={category.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/placeholder-category.jpg';
                                    }}
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                <div className="text-xs text-gray-500">ID: {category.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 max-w-md line-clamp-2">
                              {category.description || 'No description provided'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {category.products?.length || 0} products
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleOpenModal('edit', category)}
                                className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(category)}
                                className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                <div className="max-w-md mx-auto">
                  <div className="h-20 w-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No Categories Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Create your first category to start organizing your products in your e-commerce store.
                  </p>
                  <button 
                    onClick={() => handleOpenModal('add')}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Create First Category</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Enhanced Category Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100"
          >
            {/* Header with French-inspired design */}
            <div className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 flex">
                <div className="w-1/3 bg-blue-600"></div>
                <div className="w-1/3 bg-white"></div>
                <div className="w-1/3 bg-red-600"></div>
              </div>
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d={modalMode === 'add' 
                            ? "M12 6v6m0 0v6m0-6h6m-6 0H6" 
                            : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"} />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {modalMode === 'add' ? 'Create New Category' : 'Edit Category'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {modalMode === 'add' 
                        ? 'Add a new product category to organize your inventory' 
                        : 'Update the details for this category'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-5">
                {/* Category Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2 border ${formErrors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm outline-none transition-colors`}
                      placeholder="e.g. Skincare, Makeup, Fragrance"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formErrors.name}
                    </p>
                  )}
                </div>
                
                {/* Description Field */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Provide a short description of this category (optional)"
                    />
                  </div>
                </div>
                
                {/* Image Section */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category Image
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image preview column */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative w-full h-32 bg-white rounded-lg border border-gray-200 overflow-hidden mb-2">
                        {(formData.imagePreview || (currentCategory?.image && modalMode === 'edit')) ? (
                          <img 
                            src={formData.imagePreview || 
                              (currentCategory?.image 
                                ? `${import.meta.env.VITE_API_URL.split('/api')[0]}/${currentCategory.image}`
                                : null)} 
                            alt={formData.name || "Category preview"} 
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        {(formData.imagePreview || (currentCategory?.image && modalMode === 'edit')) 
                          ? "Preview" 
                          : "No image selected"}
                      </p>
                    </div>
                    
                    {/* Upload controls column */}
                    <div className="flex flex-col justify-center">
                      <label
                        htmlFor="category-image"
                        className="relative flex items-center justify-center px-4 py-2 border border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600 hover:text-blue-500">
                              Upload image
                            </span>
                          </div>
                        </div>
                        <input
                          id="category-image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImagePreview}
                          className="sr-only"
                        />
                      </label>
                      
                      {formData.image && (
                        <div className="mt-2 flex items-center text-sm text-green-600">
                          <svg className="mr-1.5 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {formData.image.name.length > 25 
                            ? `${formData.image.name.substring(0, 22)}...` 
                            : formData.image.name}
                        </div>
                      )}
                      
                      {currentCategory?.image && modalMode === 'edit' && !formData.image && (
                        <p className="mt-2 text-xs text-gray-500">
                          Current image will be kept if no new image is selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white text-right border-t border-gray-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    // Clean up any created object URLs before closing
                    if (formData.imagePreview) {
                      URL.revokeObjectURL(formData.imagePreview);
                    }
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2 rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                    submitting 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500'
                  }`}
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d={modalMode === 'add' 
                            ? "M12 6v6m0 0v6m0-6h6m-6 0H6" 
                            : "M5 13l4 4L19 7"} />
                      </svg>
                      <span>{modalMode === 'add' ? 'Create Category' : 'Save Changes'}</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-100"
          >
            <div className="text-center mb-5">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{categoryToDelete?.name}"</span>? 
                <br />This action cannot be undone.
                {categoryToDelete?.products?.length > 0 && (
                  <span className="block mt-3 text-red-600 font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                    Warning: This category contains {categoryToDelete.products.length} products.
                  </span>
                )}
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ApiDebug visible={showDebug} requests={apiRequests} />
    </div>
  );
}; 