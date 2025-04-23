import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { ROUTES } from '../constants/routes';
import { FRENCH_COLORS } from '../constants/theme';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
        setError('');
      } catch (err) {
        setError('Failed to load categories. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  // Add this helper function inside the CategoriesPage component
  const getCategoryImageUrl = (category) => {
    if (!category || !category.image) return null;
    
    // Check if the URL is relative (starts with 'uploads/' or '/uploads/')
    let imageUrl = category.image;
    if (imageUrl && (imageUrl.startsWith('uploads/') || imageUrl.startsWith('/uploads/'))) {
      // Make sure it has a leading slash
      if (!imageUrl.startsWith('/')) {
        imageUrl = '/' + imageUrl;
      }
      
      // Prepend the backend URL
      return `${import.meta.env.VITE_API_URL.split('/api')[0]}${imageUrl}`;
    }
    
    // Return the URL as is if it's already a full URL
    return imageUrl;
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient background with dynamic elements */}
      <div className="absolute inset-0 z-0" style={{
        background: `linear-gradient(to bottom, #f8fafc, #eef2ff)`
      }}>
        {/* Decorative elements and patterns */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 25%, ${FRENCH_COLORS.blue}10 0%, transparent 40%),
            radial-gradient(circle at 80% 75%, ${FRENCH_COLORS.red}10 0%, transparent 40%)
          `
        }}></div>
        
        {/* Diagonal colored strips */}
        <div className="absolute -left-20 top-1/4 h-96 w-1/3 -rotate-45 opacity-5" 
          style={{ backgroundColor: FRENCH_COLORS.blue }}>
        </div>
        <div className="absolute -right-20 bottom-1/4 h-96 w-1/3 -rotate-45 opacity-5" 
          style={{ backgroundColor: FRENCH_COLORS.red }}>
        </div>
        
        {/* French flag strips */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="w-1/3 bg-blue-600"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-red-600"></div>
        </div>
      </div>
      
      {/* Content container */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Page header with enhanced styling */}
        <div className="mb-12 text-center relative">
          <div className="inline-block px-3 py-1 mb-3 rounded-full text-sm font-medium"
            style={{ backgroundColor: `${FRENCH_COLORS.red}15`, color: FRENCH_COLORS.red }}>
            Our Categories
          </div>
          
          <h1 className="text-4xl font-bold mb-3" style={{ color: FRENCH_COLORS.dark }}>
            Shop by Category
          </h1>
          
          <div className="w-24 h-1 mx-auto mb-4" 
            style={{ background: `linear-gradient(to right, ${FRENCH_COLORS.blue}, ${FRENCH_COLORS.red})` }}>
          </div>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our curated selection of premium French-inspired cosmetics, carefully categorized to help you find the perfect products for your beauty routine.
          </p>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-transparent border-b-red-600 animate-spin" style={{ animationDuration: '1.5s' }}></div>
              <div className="absolute inset-2 rounded-full bg-white/50 backdrop-blur-sm"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: FRENCH_COLORS.blue }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {!loading && error && (
          <div className="text-center p-8 mb-8 rounded-xl bg-red-50 border-l-4 border-red-500 shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${FRENCH_COLORS.red}15` }}>
                <svg className="w-6 h-6" style={{ color: FRENCH_COLORS.red }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Categories</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-md text-white shadow-md transition-all hover:shadow-lg"
              style={{ 
                background: `linear-gradient(to right, ${FRENCH_COLORS.red}, ${FRENCH_COLORS.red}80)`,
              }}
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Categories grid with enhanced styling */}
        {!loading && !error && categories.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {categories.map(category => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                className="rounded-xl shadow-lg overflow-hidden h-80 relative group"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                <Link 
                  to={`/products?category=${category.id}`} 
                  className="block h-full"
                  onClick={() => console.log(`Navigating to category: ${category.id}`)}
                >
                  {/* French flag accent */}
                  <div className="absolute top-0 left-0 w-full h-1 z-10 flex">
                    <div className="w-1/3 bg-blue-600"></div>
                    <div className="w-1/3 bg-white"></div>
                    <div className="w-1/3 bg-red-600"></div>
                  </div>
                
                  <div className="absolute inset-0 bg-gray-900 overflow-hidden">
                    {/* Image container */}
                    {getCategoryImageUrl(category) ? (
                      <img
                        src={getCategoryImageUrl(category)}
                        alt={category.name}
                        className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    
                    {/* Badge with product count */}
                    {category.products?.length > 0 && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full shadow-sm z-10" 
                        style={{ color: FRENCH_COLORS.blue }}>
                        {category.products.length} Products
                      </div>
                    )}
                  </div>
                  
                  {/* Content container with enhanced styling */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-0">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">{category.name}</h2>
                    
                    {category.description && (
                      <p className="text-white/80 text-sm line-clamp-2 mb-4 group-hover:text-white">{category.description}</p>
                    )}
                    
                    <div className="inline-flex items-center py-2 px-4 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 transition-all group-hover:bg-white/20">
                      <span>Explore Collection</span>
                      <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    
                    {/* Decorative corner accent */}
                    <div className="absolute bottom-0 right-0 w-24 h-24 opacity-50" style={{
                      background: `linear-gradient(135deg, transparent 50%, ${FRENCH_COLORS.blue}30 50%)`,
                    }}></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Empty state */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg max-w-md mx-auto">
            <div className="inline-block p-4 rounded-full mb-4" style={{ backgroundColor: `${FRENCH_COLORS.blue}15` }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: FRENCH_COLORS.blue }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-6">We're currently updating our product categories. Please check back later for our latest collection.</p>
            <Link 
              to={ROUTES.HOME}
              className="inline-flex items-center px-4 py-2 rounded-full shadow-md text-white text-sm font-medium transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ 
                background: `linear-gradient(to right, ${FRENCH_COLORS.blue}, ${FRENCH_COLORS.red})`,
                boxShadow: `0 4px 14px rgba(0,0,0,0.15)`
              }}
            >
              Return to Home
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}; 