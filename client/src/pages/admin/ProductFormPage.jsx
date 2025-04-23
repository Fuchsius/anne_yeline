import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { ROUTES } from '../../constants/routes';
import { FRENCH_COLORS } from '../../constants/theme';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { formatImageUrl } from '../../utils/imageUtils';

export const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockCount: '',
    categoryId: '',
    brand: '',
    weight: '',
    discount: '',
    salePrice: '',
    sku: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
        
        if (isEditMode) {
          const productData = await productService.getProductById(id);
          
          // Format the data for the form
          const formattedData = {
            ...productData,
            price: productData.price?.toString() || '',
            stockCount: productData.stockCount?.toString() || '',
            categoryId: productData.categoryId?.toString() || '',
            salePrice: productData.salePrice?.toString() || '',
            discount: productData.discount?.toString() || ''
          };
          
          setFormData(formattedData);
          
          // Set existing images
          if (productData.productImages) {
            setImages(productData.productImages);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormTouched(true);
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormTouched(true);
    
    if (files.length > 0) {
      // Validate file sizes and types
      const validFiles = files.filter(file => {
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        const isValidType = file.type.startsWith('image/');
        
        if (!isValidSize) {
          setErrors(prev => ({ 
            ...prev, 
            images: `${file.name} exceeds the 5MB limit` 
          }));
        }
        
        if (!isValidType) {
          setErrors(prev => ({ 
            ...prev, 
            images: `${file.name} is not a valid image file` 
          }));
        }
        
        return isValidSize && isValidType;
      });
      
      // Create preview URLs for valid files
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
      setImageFiles(prev => [...prev, ...validFiles]);
    }
  };
  
  const removeImage = (index, type) => {
    if (type === 'existing') {
      // Store the ID of the deleted image for later processing
      const imageToDelete = images[index];
      if (imageToDelete && imageToDelete.id) {
        setDeletedImages(prev => [...prev, imageToDelete.id]);
      }
      setImages(images.filter((_, i) => i !== index));
    } else {
      setImagePreviews(imagePreviews.filter((_, i) => i !== index));
      setImageFiles(imageFiles.filter((_, i) => i !== index));
    }
    setFormTouched(true);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Product description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than zero';
    if (!formData.stockCount) newErrors.stockCount = 'Stock count is required';
    if (parseInt(formData.stockCount) < 0) newErrors.stockCount = 'Stock count cannot be negative';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    
    // Add weight validation to ensure it's a valid number when provided
    if (formData.weight && isNaN(parseFloat(formData.weight))) {
      newErrors.weight = 'Weight must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const prepareDataForSubmission = (data) => {
    // Create a copy to avoid modifying the original
    const processedData = { ...data };
    
    // Convert string values to numbers
    if (processedData.price) {
      processedData.price = Number(processedData.price);
    }
    if (processedData.stockCount) {
      processedData.stockCount = Number(processedData.stockCount);
    }
    if (processedData.categoryId) {
      processedData.categoryId = Number(processedData.categoryId);
    }
    if (processedData.discount) {
      processedData.discount = Number(processedData.discount) || null;
    }
    if (processedData.salePrice) {
      processedData.salePrice = Number(processedData.salePrice) || null;
    }
    if (processedData.weight) {
      processedData.weight = Number(processedData.weight) || null;
    }
    
    // Remove non-updatable fields
    delete processedData.category;
    delete processedData.productImages;
    delete processedData.reviews;
    delete processedData.categoryName;
    
    return processedData;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    
    try {
      console.log('Sending product data: ', formData);
      
      // Validate required fields
      const fieldErrors = {};
      if (!formData.name) fieldErrors.name = 'Name is required';
      if (!formData.description) fieldErrors.description = 'Description is required';
      if (!formData.price) fieldErrors.price = 'Price is required';
      if (!formData.stockCount && formData.stockCount !== 0) fieldErrors.stockCount = 'Stock count is required';
      if (!formData.categoryId) fieldErrors.categoryId = 'Category is required';
      
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        setSaving(false);
        return;
      }
      
      let result;
      
      if (isEditMode) {
        // Update existing product
        try {
          console.log(`Updating product #${id}`);
          const processedData = prepareDataForSubmission(formData);
          console.log('Submitting processed data:', processedData);
          result = await productService.updateProduct(id, processedData);
          console.log('Product updated successfully:', result);
          
          // Handle image uploads if there are new images
          if (imageFiles.length > 0) {
            console.log('Uploading new images...');
            const imageFormData = new FormData();
            imageFiles.forEach(file => {
              console.log('Adding file to upload:', file.name, file.type, file.size);
              imageFormData.append('images', file);
            });
            
            try {
              const uploadResult = await productService.uploadProductImages(id, imageFormData);
              console.log('Image upload result:', uploadResult);
            } catch (uploadError) {
              console.error('Image upload error:', uploadError);
              setErrors(prev => ({ 
                ...prev, 
                images: 'Images were not uploaded. Please try adding them later.' 
              }));
            }
          }
          
          // Handle image deletions if any images were marked for deletion
          for (const imageId of deletedImages) {
            try {
              await productService.deleteProductImage(imageId);
              console.log(`Successfully deleted image with ID: ${imageId}`);
            } catch (deleteError) {
              console.error(`Failed to delete image ${imageId}:`, deleteError);
            }
          }
        } catch (error) {
          console.error('Failed to update product:', error);
          
          // More specific error handling
          if (error.message.includes('404')) {
            setErrors({ form: 'Update endpoint not found. Check your server configuration.' });
          } else if (error.message.includes('DOCTYPE')) {
            setErrors({ form: 'Server error: Received HTML instead of JSON. Check your server logs.' });
          } else {
            setErrors({ form: `Failed to update product: ${error.message}` });
          }
          
          setSaving(false);
          return; // Exit early if update fails
        }
      } else {
        // Create new product
        try {
          console.log('Creating new product...');
          const processedData = prepareDataForSubmission(formData);
          console.log('Submitting processed data:', processedData);
          result = await productService.createProduct(processedData);
          console.log('Product created successfully:', result);
          
          // Only attempt to upload images if there are files and the product was created successfully
          if (imageFiles.length > 0 && result && result.id) {
            console.log('Uploading images for new product...');
            const imageFormData = new FormData();
            imageFiles.forEach(file => {
              console.log('Adding file to upload:', file.name, file.type, file.size);
              imageFormData.append('images', file);
            });
            
            try {
              const uploadResult = await productService.uploadProductImages(result.id, imageFormData);
              console.log('Image upload result:', uploadResult);
            } catch (uploadError) {
              console.error('Image upload error:', uploadError);
              setErrors(prev => ({ 
                ...prev, 
                images: 'Images were not uploaded. Please try adding them later.' 
              }));
            }
          }
        } catch (error) {
          console.error('Failed to create product:', error);
          throw error; // Re-throw to be caught by the outer catch block
        }
      }
      
      setSaveSuccess(true);
      
      // Navigate back to products page after a short delay
      setTimeout(() => {
        navigate(ROUTES.ADMIN.PRODUCTS);
      }, 1500);
    } catch (error) {
      console.error('Failed to save product:', error);
      setErrors({ form: error.message });
      setSaving(false);
      return;
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  // Add drag and drop functionality
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files);
      
      // Create an event-like object for our handler
      const mockEvent = {
        target: {
          files: fileArray
        }
      };
      
      handleImageChange(mockEvent);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col md:flex-row">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <div className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="animate-pulse">
                  <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 w-64 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto flex justify-center items-center" style={{ minHeight: "60vh" }}>
                <div className="relative h-20 w-20">
                  <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-transparent animate-spin" 
                    style={{ borderColor: `${FRENCH_COLORS.blue} transparent ${FRENCH_COLORS.red} transparent` }}>
                  </div>
                  <div className="absolute top-6 left-6 w-8 h-8 rounded-full bg-white"></div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* French-inspired header */}
              <div className="flex items-center mb-2">
                <div className="h-8 w-1.5 rounded-full bg-blue-600 mr-3"></div>
                <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
              </div>
              <div className="flex items-center">
                <div className="h-1 w-16 flex rounded-full overflow-hidden">
                  <div className="w-1/3 bg-blue-600"></div>
                  <div className="w-1/3 bg-white"></div>
                  <div className="w-1/3 bg-red-600"></div>
                </div>
                <p className="ml-3 text-gray-500">
                  {isEditMode ? 'Update product information and inventory' : 'Create a new product for your store'}
                </p>
              </div>
            </div>
          </div>
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              {/* Success message */}
              {saveSuccess && (
                <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{isEditMode ? 'Product updated successfully!' : 'Product created successfully!'}</span>
                  </div>
                </div>
              )}
              
              {/* Error message */}
              {errors.form && (
                <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>{errors.form}</span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="h-5 w-1 bg-blue-500 rounded-full mr-2"></div>
                    <h2 className="text-lg font-medium text-gray-800">Basic Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {/* Product Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Enter product name"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    
                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Enter product description"
                      ></textarea>
                      {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    </div>
                    
                    {/* Category */}
                    <div>
                      <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>}
                    </div>
                    
                    {/* Brand */}
                    <div>
                      <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                        Brand
                      </label>
                      <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={formData.brand || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter brand name"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Pricing and Inventory Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="h-5 w-1 bg-red-500 rounded-full mr-2"></div>
                    <h2 className="text-lg font-medium text-gray-800">Pricing & Inventory</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Regular Price (LKR) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">LKR</span>
                        </div>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          step="0.01"
                          min="0"
                          className={`w-full pl-12 pr-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                    </div>
                    
                    {/* Stock Count */}
                    <div>
                      <label htmlFor="stockCount" className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="stockCount"
                        name="stockCount"
                        value={formData.stockCount}
                        onChange={handleChange}
                        min="0"
                        className={`w-full px-3 py-2 border ${errors.stockCount ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="0"
                      />
                      {errors.stockCount && <p className="mt-1 text-sm text-red-500">{errors.stockCount}</p>}
                    </div>
                    
                    {/* Sale Price */}
                    <div>
                      <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Sale Price (LKR)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">LKR</span>
                        </div>
                        <input
                          type="number"
                          id="salePrice"
                          name="salePrice"
                          value={formData.salePrice || ''}
                          onChange={handleChange}
                          step="0.01"
                          min="0"
                          className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    {/* Discount Percentage */}
                    <div>
                      <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Percentage
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="discount"
                          name="discount"
                          value={formData.discount || ''}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="0"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* SKU */}
                    <div>
                      <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                        SKU (Stock Keeping Unit)
                      </label>
                      <input
                        type="text"
                        id="sku"
                        name="sku"
                        value={formData.sku || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter SKU"
                      />
                    </div>
                    
                    {/* Weight */}
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (g)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="weight"
                          name="weight"
                          value={formData.weight || ''}
                          onChange={handleChange}
                          min="0"
                          step="0.1"
                          className={`w-full px-3 py-2 border ${errors.weight ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                          placeholder="0"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">g</span>
                        </div>
                      </div>
                      {errors.weight && <p className="mt-1 text-sm text-red-500">{errors.weight}</p>}
                    </div>
                  </div>
                </div>
                
                {/* Product Images Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="h-5 w-1 bg-indigo-500 rounded-full mr-2"></div>
                    <h2 className="text-lg font-medium text-gray-800">Product Images</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Image Upload with drag and drop */}
                    <div 
                      onClick={triggerFileInput}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed ${errors.images ? 'border-red-500' : 'border-gray-300'} rounded-lg p-6 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer`}
                    >
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm font-medium text-gray-900">Drag and drop files or click to upload</p>
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {errors.images && <p className="mt-2 text-sm text-red-500">{errors.images}</p>}
                    </div>
                    
                    {/* Image Preview */}
                    {(images.length > 0 || imagePreviews.length > 0) && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Product Images</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                          {/* Existing Images */}
                          {images.map((image, index) => (
                            <div key={`existing-${index}`} className="relative group">
                              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 shadow-md">
                                <img 
                                  src={formatImageUrl(image.imageUrl)} 
                                  alt={`Product ${index + 1}`} 
                                  className="object-cover w-full h-full" 
                                  onError={(e) => {
                                    console.error(`Failed to load image: ${e.target.src}`);
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder-product.jpg';
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index, 'existing')}
                                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              <span className="mt-1 block text-xs text-gray-500 truncate">Existing</span>
                            </div>
                          ))}
                          
                          {/* New Image Previews */}
                          {imagePreviews.map((preview, index) => (
                            <div key={`preview-${index}`} className="relative group">
                              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 shadow-md">
                                <img src={preview} alt={`New upload ${index + 1}`} className="object-cover w-full h-full" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index, 'new')}
                                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              <span className="mt-1 block text-xs text-gray-500 truncate">New</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.ADMIN.PRODUCTS)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !formTouched}
                    className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium relative ${
                      saving || !formTouched ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg transform transition-all hover:-translate-y-1'
                    }`}
                  >
                    {saving ? (
                      <>
                        <span className="inline-block opacity-0">Save Product</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      </>
                    ) : (
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {isEditMode ? 'Save Changes' : 'Save Product'}
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}; 