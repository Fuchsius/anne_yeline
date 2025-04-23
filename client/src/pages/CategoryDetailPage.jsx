import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import { ProductCard } from '../components/products/ProductCard';
import { ROUTES } from '../constants/routes';
import { FRENCH_COLORS } from '../constants/theme';

export const CategoryDetailPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch category details
        const categoryData = await categoryService.getCategoryById(id);
        setCategory(categoryData);
        
        // Fetch products for this category
        const productsData = await productService.getProductsByCategory(id);
        setProducts(productsData);
        setError('');
      } catch (err) {
        console.error("Error fetching category data:", err);
        setError('Failed to load category details and products.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
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
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="p-8 mb-8 rounded-xl bg-red-50 border-l-4 border-red-500 shadow-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
        <p className="mb-6">The category you're looking for doesn't exist or has been removed.</p>
        <Link
          to={ROUTES.CATEGORIES}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Categories
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, ${FRENCH_COLORS.red}08 0%, transparent 50%),
                       linear-gradient(225deg, ${FRENCH_COLORS.blue}08 0%, transparent 50%),
                       #f8fafc`
        }}></div>
        
        {/* French flag accent */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="w-1/3 bg-blue-600"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-red-600"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full opacity-10" 
          style={{ 
            background: `radial-gradient(circle, ${FRENCH_COLORS.blue} 0%, transparent 70%)`,
          }}
        ></div>
        <div className="absolute top-40 left-10 w-64 h-64 rounded-full opacity-10" 
          style={{ 
            background: `radial-gradient(circle, ${FRENCH_COLORS.red} 0%, transparent 70%)`,
          }}
        ></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Category Header */}
        <div className="mb-12">
          <nav className="flex mb-4 text-sm">
            <Link to={ROUTES.HOME} className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link to={ROUTES.CATEGORIES} className="text-gray-500 hover:text-gray-700">Categories</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: FRENCH_COLORS.dark }}>
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-600 md:text-lg mb-6">{category.description}</p>
            )}
          </div>
          
          {/* Category Image - if available */}
          {category.imageUrl && (
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-10 shadow-lg">
              <img 
                src={`${import.meta.env.VITE_API_URL.split('/api')[0]}${category.imageUrl}`}
                alt={category.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(`Failed to load category image: ${category.name}`);
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(category.name)}&background=random&size=400&color=fff&bold=true`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-white text-xl md:text-2xl font-bold">{products.length} Products</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Products Grid */}
        {products.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map(product => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="h-full"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 12H4M12 4v16" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-4">No products found in this category</h3>
            <p className="text-gray-500 mb-6">We're regularly adding new products. Please check back later.</p>
            <Link 
              to={ROUTES.PRODUCTS}
              className="inline-flex items-center px-6 py-2 rounded-full border text-sm font-medium transition-all hover:-translate-y-1"
              style={{ 
                borderColor: FRENCH_COLORS.blue,
                color: FRENCH_COLORS.blue
              }}
            >
              Browse All Products
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