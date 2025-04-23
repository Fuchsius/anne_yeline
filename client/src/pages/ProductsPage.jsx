import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { productData } from '../data/productData';
import { ProductCard } from '../components/products/ProductCard';
import { FRENCH_COLORS } from '../constants/theme';
import { useSearchParams } from 'react-router-dom';
import { useProductFilter } from '../hooks/useProductFilter';
import { useCart } from '../context/CartContext';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [error, setError] = useState(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [activeView, setActiveView] = useState('grid'); // 'grid' or 'list'
  
  // Initialize filter with category from URL params if available
  const { filters, updateFilters, filteredProducts } = useProductFilter(products, {
    category: categoryId
  });
  
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data with categoryId:", categoryId);
        
        // Fetch all products based on whether a category is selected
        let productsData;
        if (categoryId) {
          console.log("Fetching products for category:", categoryId);
          try {
            // If category is specified, fetch products for that category
            productsData = await productService.getProductsByCategory(categoryId);
            console.log("Products fetched for category:", productsData.length);
          } catch (categoryError) {
            console.error("Error fetching products by category:", categoryError);
            // Fallback to all products if category fetch fails
            productsData = await productService.getAllProducts();
            console.log("Fetched all products as fallback:", productsData.length);
          }
        } else {
          // Otherwise fetch all products
          productsData = await productService.getAllProducts();
          console.log("Fetched all products:", productsData.length);
        }
        
        // Ensure products data is an array
        if (!Array.isArray(productsData)) {
          console.error("Products data is not an array:", productsData);
          productsData = [];
        }
        
        setProducts(productsData);
        
        // Fetch categories for the filter dropdown
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
        
        // Update selected category based on URL parameter
        if (categoryId) {
          updateFilters({ category: categoryId });
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [categoryId]);
  
  // Update the category selection state when URL changes
  useEffect(() => {
    if (categoryId) {
      // If categoryId is available in URL, update the filters
      updateFilters({ category: categoryId });
    }
  }, [categoryId]);
  
  // Update URL when category filter changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (filters.category) {
      params.set('category', filters.category);
    } else {
      params.delete('category');
    }
    
    setSearchParams(params);
  }, [filters.category, setSearchParams]);
  
  // Handle category filter change
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    updateFilters({ category: value === "all" ? null : value });
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    updateFilters({ sortBy: e.target.value });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Redesigned Premium Hero Header with French Flag Theme */}
      <div className="relative overflow-hidden">
        {/* Elegant full-width tricolor ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex z-10">
          <div className="w-1/3 bg-blue-600"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-red-600"></div>
        </div>
        
        {/* Background with premium gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)`,
          }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-white/10 to-red-900/20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-12 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-12 w-64 h-64 rounded-full bg-red-600/10 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800 leading-tight">
              <span className="block">Our Cosmatic</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-red-600">Collection</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover our premium selection of beauty products, crafted with the finest French techniques 
              and ingredients for exceptional skincare and cosmetic experiences.
            </p>
            
            
            
            {/* Scrolling indicator */}
            <motion.div 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-6 h-10 rounded-full border-2 border-gray-400 flex justify-center pt-1"
              >
                <div className="w-1 h-2 rounded-full bg-gray-400"></div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Curved wave separator */}
        <div className="absolute bottom-0 left-0 right-0 h-16 text-white overflow-hidden">
          <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 24L60 29.3C120 34.7 240 45.3 360 45.3C480 45.3 600 34.7 720 40C840 45.3 960 66.7 1080 69.3C1200 72 1320 56 1380 48L1440 40V74H1380C1320 74 1200 74 1080 74C960 74 840 74 720 74C600 74 480 74 360 74C240 74 120 74 60 74H0V24Z" fill="white"/>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-4 relative z-20">
        {/* Filter Categories with French Theme */}
        <div className="mb-8 bg-white p-4 rounded-2xl shadow-md">

          {/* Refined Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Box with French-style focus */}
            <div className="w-full md:w-1/3 relative">
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  updateFilters({ search: e.target.value });
                }}
              />
              <svg 
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Dropdown with French Colors */}
            <div className="w-full md:w-1/3 relative">
              <select 
                className="w-full appearance-none pl-4 pr-10 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
                value={filters.category || "all"}
                onChange={handleCategoryChange}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {typeof category.name === 'string' ? category.name : 'Unknown Category'}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Sort By Dropdown with Red Accent */}
            <div className="w-full md:w-1/3 relative">
              <select 
                className="w-full appearance-none pl-4 pr-10 py-3 rounded-full border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition-all"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="name">Sort by: Name</option>
                <option value="price-asc">Sort by: Price (Low to High)</option>
                <option value="price-desc">Sort by: Price (High to Low)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.category || searchTerm) && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm flex flex-wrap items-center gap-3">
            <div className="flex items-center">
              <div className="flex space-x-1 mr-3">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                <div className="w-1 h-6 bg-white border border-gray-200 rounded-full"></div>
                <div className="w-1 h-6 bg-red-600 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
            </div>
            
            {filters.category && categories.find(c => c.id === filters.category) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                <span className="mr-1">Category:</span>
                {categories.find(c => c.id === filters.category)?.name}
                <button
                  onClick={() => updateFilters({ category: null })}
                  className="ml-1 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
            
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                <span className="mr-1">Search:</span> {searchTerm}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    updateFilters({ search: '' });
                  }}
                  className="ml-1 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
            
            {(filters.category || searchTerm) && (
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchTerm('');
                  updateFilters({ category: null, search: '' });
                }}
                className="ml-auto text-sm text-gray-600 hover:text-red-600 transition-colors underline flex items-center"
              >
                <span>Clear all</span>
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="relative h-16 w-16 mb-4">
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" 
                style={{ borderColor: `#002395 transparent #ED2939 transparent` }}>
              </div>
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white"></div>
            </div>
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : (
          <>
            {/* Products Count with View Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm gap-4">
              <div className="flex items-center">
                <div className="flex space-x-1 mr-3">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  <div className="w-1 h-8 bg-white border border-gray-200 rounded-full"></div>
                  <div className="w-1 h-8 bg-red-600 rounded-full"></div>
                </div>
                <p className="text-gray-600">
                  Showing <span className="font-medium">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              
              {/* Enhanced View Toggle */}
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">View:</span>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    className={`p-2 ${activeView === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setActiveView('grid')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  
                </div>
              </div>
            </div>
            
            {/* No Products Found State */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-md">
                <div className="mx-auto w-24 h-24 mb-4 relative">
                  {/* French flag inspired empty state */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 w-1/3 h-full bg-blue-600"></div>
                    <div className="absolute left-1/3 top-0 w-1/3 h-full bg-white border-t border-b border-gray-200"></div>
                    <div className="absolute right-0 top-0 w-1/3 h-full bg-red-600"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria.</p>
                <div className="mt-6">
                  <button 
                    className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-red-600 text-white hover:from-blue-700 hover:to-red-700 transition-colors"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchTerm('');
                      updateFilters({ category: null, search: '' });
                    }}
                  >
                    <svg className="mr-2 -ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset all filters
                  </button>
                </div>
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={activeView === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "space-y-4"
                }
              >
                {filteredProducts.map(product => (
                  <motion.div 
                    key={product.id} 
                    variants={itemVariants}
                    className={activeView === 'list' ? "bg-white rounded-xl shadow-sm overflow-hidden" : ""}
                  >
                    {activeView === 'grid' ? (
                      <ProductCard 
                        product={product} 
                        onAddToCart={handleAddToCart}
                      />
                    ) : (
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-64 md:h-auto relative bg-gray-100">
                          {product.productImages && product.productImages.length > 0 ? (
                            <img 
                              src={product.productImages[0].imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover object-center"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="md:w-2/3 p-6 flex flex-col">
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-500">
                              {typeof product.category === 'object' && product.category 
                                ? (typeof product.category.name === 'string' ? product.category.name : 'Unknown Category') 
                                : (typeof product.category === 'string' ? product.category : 'Unknown Category')}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2" style={{ color: FRENCH_COLORS.dark }}>
                            {product.name}
                          </h3>
                          <p className="text-gray-600 mb-6 flex-grow">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-end">
                            <div>
                              {product.discount > 0 ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold" style={{ color: FRENCH_COLORS.red }}>
                                      LKR {Math.round(product.price).toLocaleString()}
                                    </span>
                                    <span className="text-sm line-through text-gray-500">
                                      LKR {(product.originalPrice || (product.price / (1 - product.discount/100))).toLocaleString()}
                                    </span>
                                  </div>
                                  <span className="text-xs text-green-600">Save {product.discount}%</span>
                                </>
                              ) : (
                                <span className="text-xl font-bold" style={{ color: FRENCH_COLORS.blue }}>
                                  LKR {product.price.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <button
                              className="flex items-center px-4 py-2 rounded-full shadow-md text-white"
                              style={{ backgroundColor: FRENCH_COLORS.red }}
                              onClick={() => {
                                handleAddToCart(product);
                              }}
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}; 