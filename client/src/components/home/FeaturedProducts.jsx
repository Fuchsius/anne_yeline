import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ROUTES } from '../../constants/routes';
import { FRENCH_COLORS } from '../../constants/theme';
import { ProductCard } from '../products/ProductCard';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useCart } from '../../context/CartContext';

export const FeaturedProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Fetch data from the database
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products and full category objects
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories()
        ]);
        
        console.log("Products fetched from database:", productsData.length);
        console.log("Categories fetched from database:", categoriesData.length);
        
        // Get categories from the data
        const categoryNames = ["All", ...categoriesData.map(cat => cat.name)];
        setCategories(categoryNames);
        
        // Format products and limit to 8
        setProducts(productsData.slice(0, 8));
        setLoading(false);

        // Add this inside the fetchProducts function after receiving data
        console.log("First product details:", productsData.length > 0 ? JSON.stringify(productsData[0], null, 2) : "No products");
        // Check if products have image properties
        const hasImages = productsData.some(p => p.image || (p.productImages && p.productImages.length > 0));
        console.log("Products have images:", hasImages);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Helper function to format category image URLs
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
  
  // Filter products based on selected category
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => 
        product.category && product.category.name === selectedCategory
      );

  // Handle add to cart
  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background with French-inspired gradients and patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute h-full w-full" 
          style={{ 
            backgroundImage: `
              radial-gradient(circle at 80% 20%, ${FRENCH_COLORS.blue}10 0%, transparent 40%),
              radial-gradient(circle at 20% 80%, ${FRENCH_COLORS.red}10 0%, transparent 40%)
            `
          }}
        />
        
        {/* French flag accent line at the top */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="w-1/3 bg-blue-600"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-red-600"></div>
        </div>
        
        {/* Floating decorative shapes */}
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-15" 
          style={{ 
            background: `radial-gradient(circle, ${FRENCH_COLORS.blue} 0%, transparent 70%)`,
            animation: 'float 15s ease-in-out infinite'
          }}>
        </div>
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full opacity-15" 
          style={{ 
            background: `radial-gradient(circle, ${FRENCH_COLORS.red} 0%, transparent 70%)`,
            animation: 'float 18s ease-in-out infinite'
          }}>
        </div>
        
        {/* Decorative diagonal strips */}
        <div className="absolute -left-10 top-1/4 h-80 w-1/3 -rotate-45 opacity-5" 
          style={{ backgroundColor: FRENCH_COLORS.blue }}>
        </div>
        <div className="absolute -right-10 bottom-1/4 h-80 w-1/3 -rotate-45 opacity-5" 
          style={{ backgroundColor: FRENCH_COLORS.red }}>
        </div>
        
        <style jsx="true">{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
        `}</style>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header - Matching the original style */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 mb-3 rounded-full text-sm font-medium"
            style={{ backgroundColor: `${FRENCH_COLORS.blue}15`, color: FRENCH_COLORS.blue }}>
            Our Selection
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium French-inspired cosmetics, carefully curated to enhance your beauty routine.
          </p>
        </div>
        
        {/* Category filters */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex space-x-2">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
                style={{ 
                  background: selectedCategory === category 
                    ? `linear-gradient(to right, ${FRENCH_COLORS.blue}, ${FRENCH_COLORS.red})` 
                    : undefined 
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Error Message with improved styling */}
        {loading && (
          <div className="text-center p-8 mb-8 rounded-xl bg-red-50 border-l-4 border-red-500 shadow-md">
            <p className="text-red-600 font-medium">Loading products...</p>
          </div>
        )}
        
        {/* Products grid with loading state */}
        {loading ? (
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
        ) : (
          filteredProducts.length > 0 ? (
            /* Product grid with enhanced shadow and animation */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.05))' }}
                >
                  <ProductCard 
                    product={product} 
                    onAddToCart={handleAddToCart} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-4">We couldn't find any products for the selected category.</p>
              <button 
                onClick={() => setSelectedCategory("All")} 
                className="px-4 py-2 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                style={{ backgroundColor: FRENCH_COLORS.blue }}
              >
                Show All Products
              </button>
            </div>
          )
        )}
        
        {/* View all products button with enhanced styling */}
        <div className="mt-12 text-center">
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-flex items-center px-6 py-3 rounded-full shadow-md text-white text-base font-medium transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{ 
              background: `linear-gradient(to right, ${FRENCH_COLORS.blue}, ${FRENCH_COLORS.red})`,
              boxShadow: `0 4px 14px rgba(0,0,0,0.15)`
            }}
          >
            View All Products
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}; 