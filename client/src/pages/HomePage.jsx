import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ROUTES } from '../constants/routes';
import { COLORS } from '../constants/colors';
import { FRENCH_COLORS } from '../constants/theme';
import { ProductCard } from '../components/products/ProductCard';
import { CategoryCard } from '../components/categories/CategoryCard';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { VideoSection } from '../components/home/VideoSection';
import { TestimonialSection } from '../components/home/TestimonialSection';
import { TrustBadges } from '../components/home/TrustBadges';
import { motion } from 'framer-motion';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
        console.log("Fetched categories:", categoriesData.length);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Scroll functions for horizontal navigation
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Add this helper function in HomePage component near the other utility functions
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
    <div>
      <HeroSection />
      <FeaturedProducts />
      
      {/* Categories - Horizontal Scrollable Design with Enhanced Background */}
      <section className="py-16 relative overflow-hidden">
        {/* Enhanced colorful background */}
        <div className="absolute inset-0 z-0" style={{
          background: `
            linear-gradient(135deg, ${FRENCH_COLORS.red}10 0%, transparent 50%),
            linear-gradient(225deg, ${FRENCH_COLORS.blue}10 0%, transparent 50%),
            linear-gradient(to bottom, #f4f8fb 0%, #edf2f7 100%)
          `
        }}>
          {/* Decorative elements - French flag strip */}
          <div className="absolute bottom-0 left-0 right-0 h-1 flex">
            <div className="w-1/3 bg-blue-600"></div>
            <div className="w-1/3 bg-white"></div>
            <div className="w-1/3 bg-red-600"></div>
          </div>
          
          {/* Floating decorative shapes */}
          <div className="absolute top-40 right-20 w-48 h-48 rounded-full opacity-15" 
            style={{ 
              background: `radial-gradient(circle, ${FRENCH_COLORS.blue} 0%, transparent 70%)`,
              animation: 'float-slow 18s ease-in-out infinite'
            }}>
          </div>
          <div className="absolute bottom-40 left-20 w-56 h-56 rounded-full opacity-15" 
            style={{ 
              background: `radial-gradient(circle, ${FRENCH_COLORS.red} 0%, transparent 70%)`,
              animation: 'float-slow 15s ease-in-out infinite reverse'
            }}>
          </div>
          
          {/* Decorative diagonal strips */}
          <div className="absolute -right-10 top-1/4 h-96 w-1/3 -rotate-45 opacity-5" 
            style={{ backgroundColor: FRENCH_COLORS.blue }}>
          </div>
          <div className="absolute -left-10 bottom-1/4 h-96 w-1/3 -rotate-45 opacity-5" 
            style={{ backgroundColor: FRENCH_COLORS.red }}>
          </div>
          
          {/* Animated particles effect */}
          <div className="absolute inset-0 opacity-30" style={{ 
            backgroundImage: `radial-gradient(circle at 30% 50%, ${FRENCH_COLORS.blue}20 0%, transparent 8%), 
                              radial-gradient(circle at 70% 70%, ${FRENCH_COLORS.red}20 0%, transparent 8%)`,
            backgroundSize: '120px 120px',
            animation: 'move-bg 60s linear infinite'
          }}></div>
          
          <style jsx="true">{`
            @keyframes float-slow {
              0%, 100% { transform: translateY(0) rotate(0); }
              50% { transform: translateY(-30px) rotate(3deg); }
            }
            @keyframes move-bg {
              0% { background-position: 0% 0%; }
              100% { background-position: 100% 100%; }
            }
          `}</style>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-10 text-center">
            <div 
              className="inline-block px-3 py-1 mb-2 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${FRENCH_COLORS.red}15`, color: FRENCH_COLORS.red }}
            >
              Our Collection
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collection of premium French-inspired cosmetics, lovingly crafted for your beauty needs.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              {/* Enhanced loading spinner matching FeaturedProducts */}
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
            <div className="relative mt-8">
              {/* Navigation Arrows */}
              <button 
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 shadow-lg 
                    opacity-80 hover:opacity-100 transition-all hover:scale-110"
                aria-label="Scroll left"
                style={{ 
                  background: `linear-gradient(135deg, ${FRENCH_COLORS.blue}, ${FRENCH_COLORS.blue}80)`,
                  color: 'white',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 shadow-lg 
                    opacity-80 hover:opacity-100 transition-all hover:scale-110"
                aria-label="Scroll right"
                style={{ 
                  background: `linear-gradient(135deg, ${FRENCH_COLORS.red}, ${FRENCH_COLORS.red}80)`,
                  color: 'white',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Horizontal Scrollable Container */}
              <div 
                ref={scrollContainerRef}
                className="flex space-x-6 pb-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.map((category) => (
                  <motion.div 
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className="flex-none w-72 sm:w-80 snap-center"
                  >
                    <Link to={`/categories/${category.id}`} className="block group h-full">
                      <div className="relative h-full overflow-hidden rounded-xl shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        {/* French flag accent */}
                        <div className="absolute top-0 left-0 w-full h-1 z-10 flex">
                          <div className="w-1/3 bg-blue-600"></div>
                          <div className="w-1/3 bg-white"></div>
                          <div className="w-1/3 bg-red-600"></div>
                        </div>
                        
                        <div className="relative aspect-[5/4] overflow-hidden bg-gray-100">
                          {getCategoryImageUrl(category) ? (
                            <img 
                              src={getCategoryImageUrl(category)}
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <div className="text-center text-4xl font-bold text-gray-300">
                                {category.name.charAt(0)}
                              </div>
                            </div>
                          )}
                          
                          {/* Badge with product count */}
                          {category.products?.length > 0 && (
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full shadow-sm z-10" 
                              style={{ color: FRENCH_COLORS.blue }}>
                              {category.products.length} Products
                            </div>
                          )}
                          
                          {/* Decorative gradient overlay */}
                          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-xl font-bold mb-2" style={{ color: FRENCH_COLORS.dark }}>
                            {category.name}
                          </h3>
                          
                          {category.description && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{category.description}</p>
                          )}
                          
                          <div className="flex items-center text-sm font-medium transition-colors" 
                            style={{ color: FRENCH_COLORS.red }}>
                            Explore Collection
                            <svg className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Mobile scroll indicators */}
              <div className="flex justify-center mt-4 space-x-1 sm:hidden">
                {categories.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}
                  ></div>
                ))}
              </div>
            </div>
          )}
          
          {/* View all categories button - enhanced styling matching FeaturedProducts */}
          {categories.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                to={ROUTES.CATEGORIES}
                className="inline-flex items-center px-6 py-3 rounded-full shadow-md text-white text-base font-medium transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ 
                  background: `linear-gradient(to right, ${FRENCH_COLORS.blue}, ${FRENCH_COLORS.red})`,
                  boxShadow: `0 4px 14px rgba(0,0,0,0.15)`
                }}
              >
                View All Categories
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Video Section */}
      <VideoSection />
      
      {/* Testimonials */}
      <TestimonialSection />
    </div>
  );
}; 