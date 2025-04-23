import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ROUTES } from '../../constants/routes';
import { FRENCH_COLORS } from '../../constants/theme';
import { COLORS } from '../../constants/colors';

// Featured product images for side panel - Using local images
const productImages = [
  {
    url: '/Hero-Images/17.jpg',
    alt: 'Premium skincare products',
    title: 'Hydrating Cream',
    category: 'Skincare'
  },
  {
    url: '/Hero-Images/18.jpg',
    alt: 'Luxury makeup collection',
    title: 'Signature Collection',
    category: 'Makeup'
  },
  {
    url: '/Hero-Images/19.jpg',
    alt: 'Elegant fragrance bottles',
    title: 'Essence Parfum',
    category: 'Fragrance'
  }
];

// Backup images for fallback
const fallbackImages = [
  '/Hero-Images/14.jpg',
  '/Hero-Images/15.jpg',
  '/Hero-Images/16.jpg'
];

// Words for typing animation
const typingTexts = [
  "Beauty",
  "Elegance",
  "Luxury",
  "Radiance"
];

// Stats for the badge section
const statsBadges = [
  { number: "10,000+", label: "Satisfied Customers" },
  { number: "98%", label: "Customer Satisfaction" },
  { number: "500+", label: "Premium Products" },
  { number: "24/7", label: "Expert Support" }
];

export const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const typingSpeed = useRef(150);
  const pauseDuration = useRef(1500);

  // Reset image errors when component mounts
  useEffect(() => {
    setImageErrors({});
  }, []);

  // Handle image error
  const handleImageError = (index) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
    console.warn(`Failed to load image for product: ${productImages[index].title}`);
  };

  // Handle image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % productImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle typing animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentWord = typingTexts[typingIndex];
      
      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        
        if (displayText.length === currentWord.length) {
          setIsDeleting(true);
          typingSpeed.current = pauseDuration.current;
        } else {
          typingSpeed.current = Math.max(50, 150 - Math.random() * 75);
        }
      } else {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        
        if (displayText.length === 0) {
          setIsDeleting(false);
          setTypingIndex((prev) => (prev + 1) % typingTexts.length);
          typingSpeed.current = 150;
        } else {
          typingSpeed.current = Math.max(30, 80 - Math.random() * 40);
        }
      }
    }, typingSpeed.current);
    
    return () => clearTimeout(timeout);
  }, [displayText, typingIndex, isDeleting]);

  // Get image source with fallback handling
  const getImageSource = (index) => {
    if (imageErrors[index]) {
      return fallbackImages[index] || '/Hero-Images/17.jpg';
    }
    return productImages[index].url;
  };

  return (
    <div className="relative overflow-hidden" style={{ 
      background: `linear-gradient(135deg, #FCF5F7 0%, #FFFFFF 30%, #F0F8FF 70%, #F8F7FC 100%)`,
      backgroundSize: "200% 200%",
      animation: "gradientFlow 15s ease infinite"
    }}>
      {/* Add keyframes animation to the component */}
      <style jsx>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
      
      {/* Enhanced colorful background elements */}
      <div 
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full z-0 opacity-15 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${FRENCH_COLORS.red} 0%, ${FRENCH_COLORS.red}40 30%, transparent 70%)` 
        }}
      />
      
      <div 
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full z-0 opacity-15 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${FRENCH_COLORS.blue} 0%, ${FRENCH_COLORS.blue}40 30%, transparent 70%)` 
        }}
      />
      
      {/* Add diagonal colorful strips */}
      <div
        className="absolute -top-20 -right-20 w-96 h-[150vh] rotate-30 opacity-10 z-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${FRENCH_COLORS.blue}40 40%, ${FRENCH_COLORS.red}40 60%, transparent 100%)`
        }}
      />
      
      <div
        className="absolute -bottom-20 -left-20 w-96 h-[150vh] -rotate-30 opacity-10 z-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${FRENCH_COLORS.red}40 40%, ${FRENCH_COLORS.blue}40 60%, transparent 100%)`
        }}
      />
      
      {/* Add central elegant gradient overlay */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-[80%] h-[70%] opacity-15 z-0 rounded-full blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, #FFFFFF 0%, ${FRENCH_COLORS.blue}10 40%, ${FRENCH_COLORS.red}10 70%, transparent 100%)`
        }}
      />
      
      {/* Colorful floating shapes */}
      <motion.div 
        className="absolute top-1/4 left-1/3 w-16 h-16 rounded-full z-0 opacity-20 pointer-events-none"
        style={{ backgroundColor: FRENCH_COLORS.red }}
        animate={{ 
          y: [0, -20, 0],
          x: [0, 10, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 10,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/3 w-12 h-12 rounded-lg rotate-45 z-0 opacity-15 pointer-events-none"
        style={{ backgroundColor: FRENCH_COLORS.blue }}
        animate={{ 
          y: [0, 15, 0],
          x: [0, -10, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 12,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div 
        className="absolute top-2/3 left-1/4 w-8 h-8 rounded-full z-0 mix-blend-multiply opacity-20 pointer-events-none"
        style={{ backgroundColor: FRENCH_COLORS.red }}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 15,
          ease: "easeInOut"
        }}
      />
      
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-5 pointer-events-none"
        style={{ 
          backgroundImage: `radial-gradient(${FRENCH_COLORS.dark} 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />
      
      {/* Add this right after the opening div of the hero section */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, ${FRENCH_COLORS.red}20 0%, transparent 25%),
              radial-gradient(circle at 80% 70%, ${FRENCH_COLORS.blue}20 0%, transparent 20%),
              radial-gradient(circle at 40% 80%, ${FRENCH_COLORS.red}10 0%, transparent 30%),
              radial-gradient(circle at 70% 20%, ${FRENCH_COLORS.blue}10 0%, transparent 25%)
            `
          }}
        />
      </div>
      
      {/* Also add subtle animated gradients that move */}
      <motion.div
        className="absolute inset-0 z-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 20,
          ease: "linear"
        }}
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 0%, ${FRENCH_COLORS.blue}05 25%, transparent 50%, 
            ${FRENCH_COLORS.red}05 75%, transparent 100%)
          `,
          backgroundSize: "200% 200%"
        }}
      />
      
      {/* Temporary debugging style */}
      <style jsx>{`
        .debug-clickable {
          outline: 2px solid red !important;
          position: relative;
          z-index: 1000 !important;
        }
      `}</style>
      
      {/* Main hero section */}
      <div className="container relative mx-auto px-4 py-8 md:py-12 lg:py-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content column */}
          <div className="order-2 lg:order-1 max-w-xl mx-auto lg:mx-0 relative">
            {/* Add a subtle backdrop to the content */}
            <div 
              className="absolute inset-0 -m-8 rounded-3xl opacity-10 z-0"
              style={{
                background: `radial-gradient(circle at center, white 0%, transparent 70%)`,
                filter: "blur(40px)"
              }}
            />
            
            {/* Accent stripe - enhanced with box shadow */}
            <div className="flex h-2 w-32 mb-6 rounded-full overflow-hidden shadow-md">
              <div className="w-1/3" style={{ backgroundColor: FRENCH_COLORS.blue }}></div>
              <div className="w-1/3 bg-white"></div>
              <div className="w-1/3" style={{ backgroundColor: FRENCH_COLORS.red }}></div>
            </div>
            
            {/* Branded tagline with enhanced background */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-3 px-4 py-2 rounded-full"
              style={{ 
                backgroundColor: `${FRENCH_COLORS.blue}15`,
                border: `1px solid ${FRENCH_COLORS.blue}30`
              }}
            >
              <span className="text-sm uppercase tracking-widest font-bold" style={{ color: FRENCH_COLORS.blue }}>
                YOUR TRUSTED BEAUTY PARTNER
              </span>
            </motion.div>
            
            {/* Main heading with enhanced background and styling */}
            <motion.div 
              className="mt-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative">
                <h1 className="text-4xl md:text-5xl font-bold" style={{ color: FRENCH_COLORS.dark }}>
                  Discover AnneYelina
                  <div className="mt-2">
                    Your Passport to
                    <span className="relative inline-block ml-3 px-2" style={{ 
                      color: FRENCH_COLORS.dark
                    }}>
                      Effortless
                      <div className="absolute -bottom-1 left-0 w-full h-1.5 rounded-full" style={{ 
                        backgroundColor: `${FRENCH_COLORS.blue}30`
                      }}></div>
                    </span>
                  </div>
                  
                  {/* Fixed typing animation container */}
                  <div className="mt-2 h-16 md:h-20 relative"> {/* Fixed height container */}
                    <span 
                      className="absolute top-0 left-0 text-5xl md:text-6xl"
                      style={{ color: FRENCH_COLORS.red }}
                    >
                      {displayText}
                      <motion.span 
                        className="inline-block w-0.5 h-full ml-1" 
                        style={{ backgroundColor: FRENCH_COLORS.red }}
                        animate={{ opacity: [0, 1, 1, 0] }}
                        transition={{ 
                          duration: 1.2, 
                          repeat: Infinity,
                          times: [0, 0.3, 0.7, 1]
                        }}
                      />
                    </span>
                  </div>
                </h1>
              </div>
              
              {/* Decorative dots */}
              <div className="flex space-x-1.5 mt-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: FRENCH_COLORS.red }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: FRENCH_COLORS.blue }}></div>
              </div>
            </motion.div>
            
            {/* Description with enhanced background */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-4 rounded-lg mb-8 border-l-4"
              style={{ 
                backgroundColor: `${FRENCH_COLORS.offWhite}80`,
                borderLeftColor: FRENCH_COLORS.blue
              }}
            >
              <p className="text-lg" style={{ color: FRENCH_COLORS.gray }}>
                Experience the finest French cosmetics, meticulously crafted with premium ingredients for natural beauty that lasts all day.
              </p>
            </motion.div>
            
            {/* CTA buttons with enhanced styling and improved interactivity */}
            <motion.div 
              className="flex flex-wrap gap-4 mb-10 relative z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link 
                to={ROUTES.PRODUCTS}
                className="inline-flex items-center px-8 py-3.5 rounded-full font-medium text-white transition-all shadow-lg debug-clickable"
                style={{ 
                  backgroundColor: FRENCH_COLORS.red,
                  boxShadow: `0 4px 14px ${FRENCH_COLORS.red}40`,
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  console.log('Shop Collection button clicked');
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#c8343f';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${FRENCH_COLORS.red}60`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = FRENCH_COLORS.red;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 14px ${FRENCH_COLORS.red}40`;
                }}
              >
                Shop Collection
                <svg className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              
              <Link 
                to={ROUTES.PRODUCTS}
                className="inline-flex items-center px-8 py-3.5 rounded-full font-medium transition-all shadow-md relative z-10"
                style={{ 
                  color: FRENCH_COLORS.blue, 
                  backgroundColor: 'white',
                  border: `2px solid ${FRENCH_COLORS.blue}30`,
                  boxShadow: `0 4px 10px rgba(0,0,0,0.05)`,
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  console.log('Cosmetics button clicked');
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = FRENCH_COLORS.blue;
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 14px ${FRENCH_COLORS.blue}30`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = FRENCH_COLORS.blue;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 10px rgba(0,0,0,0.05)`;
                }}
              >
                <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Contact Us
              </Link>
            </motion.div>
            
            {/* Stats badges with enhanced design */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {statsBadges.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="flex flex-col items-center py-3 px-2 rounded-lg"
                  style={{ 
                    backgroundColor: index % 2 === 0 
                      ? `${FRENCH_COLORS.blue}10` 
                      : `${FRENCH_COLORS.red}10`,
                    border: `1px solid ${index % 2 === 0 
                      ? `${FRENCH_COLORS.blue}20` 
                      : `${FRENCH_COLORS.red}20`}`
                  }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                    backgroundColor: index % 2 === 0 
                      ? `${FRENCH_COLORS.blue}15` 
                      : `${FRENCH_COLORS.red}15`
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span 
                    className="font-bold text-xl md:text-2xl"
                    style={{ color: index % 2 === 0 ? FRENCH_COLORS.blue : FRENCH_COLORS.red }}
                  >
                    {stat.number}
                  </span>
                  <span 
                    className="text-xs text-center"
                    style={{ color: FRENCH_COLORS.gray }}
                  >
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Right image column - enhanced with better styling */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative h-[500px] max-w-md mx-auto">
              {/* Replace the simple backdrop with gradient version */}
              <div 
                className="absolute h-full w-full rounded-2xl z-0"
                style={{ 
                  background: `linear-gradient(135deg, 
                    ${FRENCH_COLORS.blue}10 0%, 
                    ${FRENCH_COLORS.blue}15 25%, 
                    ${FRENCH_COLORS.red}15 75%, 
                    ${FRENCH_COLORS.red}10 100%
                  )`,
                  boxShadow: `
                    0 20px 50px rgba(0,0,0,0.1),
                    0 5px 15px ${FRENCH_COLORS.blue}15,
                    0 -5px 15px ${FRENCH_COLORS.red}15
                  `,
                  border: `1px solid rgba(255,255,255,0.3)`,
                  filter: "blur(1px)"
                }}
              />
              
              {/* Enhanced decorative circle with gradient */}
              <div 
                className="absolute h-[450px] w-[450px] rounded-full -top-20 -right-20 z-0"
                style={{ 
                  background: `radial-gradient(circle, 
                    ${FRENCH_COLORS.offWhite} 0%, 
                    ${FRENCH_COLORS.offWhite}40 40%,
                    ${FRENCH_COLORS.red}05 70%,
                    transparent 100%
                  )`,
                  border: `3px dashed ${FRENCH_COLORS.red}25`,
                  opacity: 0.8
                }}
              />
              
              {/* Enhanced smaller circle with gradient */}
              <div 
                className="absolute h-[180px] w-[180px] rounded-full bottom-10 left-0 z-0"
                style={{ 
                  background: `radial-gradient(circle, 
                    ${FRENCH_COLORS.blue}15 0%, 
                    ${FRENCH_COLORS.blue}20 50%,
                    transparent 100%
                  )`,
                  border: `2px dashed ${FRENCH_COLORS.blue}40`,
                  opacity: 0.8
                }}
              />
              
              {/* Fix the small floating shapes with simpler animations */}
              <motion.div 
                className="absolute h-24 w-24 top-20 left-10 z-0 opacity-20"
                style={{ 
                  backgroundImage: `linear-gradient(45deg, ${FRENCH_COLORS.blue}50, ${FRENCH_COLORS.red}50)`,
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                }}
                animate={{ 
                  y: [-5, 5],
                  rotate: [0, 15]
                }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                  rotate: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                }}
              />
              
              <motion.div 
                className="absolute h-16 w-16 rounded-full bottom-20 right-10 z-0 opacity-30"
                style={{ 
                  background: `conic-gradient(${FRENCH_COLORS.red}, ${FRENCH_COLORS.blue}, ${FRENCH_COLORS.white}, ${FRENCH_COLORS.red})` 
                }}
                animate={{ 
                  scale: [1, 1.1],
                  rotate: [0, 180]
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                }}
              />
              
              {/* Simplified image animation - remove rotateY and z transforms which cause issues */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  className="relative z-10 h-full w-full rounded-2xl overflow-hidden"
                  style={{ 
                    boxShadow: `
                      0 20px 40px rgba(0,0,0,0.15),
                      0 0 0 1px ${FRENCH_COLORS.red}20,
                      0 0 0 4px white,
                      0 0 0 5px ${FRENCH_COLORS.blue}20
                    `
                  }}
                >
                  {/* Glossy overlay */}
                  <div 
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{ 
                      background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`,
                      borderRadius: "inherit"
                    }}
                  />
                  
                  {/* Image */}
                  <img 
                    src={getImageSource(currentImage)}
                    alt={productImages[currentImage].alt}
                    className="h-full w-full object-cover transform scale-105"
                    onError={() => handleImageError(currentImage)}
                  />
                  
                  {/* Colorful corner accent */}
                  <div
                    className="absolute top-0 right-0 w-24 h-24 z-10"
                    style={{
                      background: `linear-gradient(135deg, transparent 50%, ${FRENCH_COLORS.red}40 50%)`,
                      borderTopRightRadius: 'inherit'
                    }}
                  />
                  
                  {/* Enhanced product label */}
                  <motion.div
                    initial={{ opacity: 0, y: 30, x: -10 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="absolute left-5 bottom-5 bg-white/85 backdrop-blur-md p-4 rounded-xl shadow-xl z-20"
                    style={{
                      borderLeft: `4px solid ${FRENCH_COLORS.red}`,
                      boxShadow: `
                        0 10px 25px rgba(0,0,0,0.1),
                        0 0 0 1px rgba(255,255,255,0.8)
                      `
                    }}
                  >
                    <motion.h3 
                      className="font-bold text-lg mb-1" 
                      style={{ color: FRENCH_COLORS.dark }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      {productImages[currentImage].title}
                    </motion.h3>
                    
                    <div className="flex items-center">
                      <motion.span 
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium mr-2"
                        style={{ 
                          backgroundColor: `${FRENCH_COLORS.blue}15`,
                          color: FRENCH_COLORS.blue
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        {productImages[currentImage].category}
                      </motion.span>
                      
                      <motion.div 
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className="w-3 h-3" 
                            fill={i < 4 ? FRENCH_COLORS.red : 'none'} 
                            stroke={FRENCH_COLORS.red} 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              
              {/* Enhanced image navigation controls */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 z-30 flex space-x-1.5 bg-white px-6 py-3 rounded-full shadow-lg"
                style={{ 
                  boxShadow: `
                    0 10px 25px rgba(0,0,0,0.1),
                    0 2px 5px rgba(0,0,0,0.05),
                    inset 0 0 0 1px rgba(255,255,255,0.9)
                  `,
                  cursor: 'pointer'
                }}
              >
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage(index);
                      console.log(`Go to product ${index + 1}`);
                    }}
                    className="relative p-2 transition-all duration-300"
                    aria-label={`Go to product ${index + 1}`}
                  >
                    <span 
                      className={`block w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        currentImage === index 
                          ? 'scale-100' 
                          : 'scale-75 opacity-50 hover:opacity-70'
                      }`}
                      style={{ 
                        backgroundColor: currentImage === index 
                          ? FRENCH_COLORS.red
                          : FRENCH_COLORS.gray
                      }}
                    />
                    {currentImage === index && (
                      <motion.span 
                        className="absolute inset-0 rounded-full -z-10"
                        layoutId="activeNavDot"
                        style={{ 
                          backgroundColor: `${FRENCH_COLORS.red}15` 
                        }}
                      />
                    )}
                  </button>
                ))}
                
                {/* Slide arrow controls */}
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage((prev) => (prev - 1 + productImages.length) % productImages.length);
                      console.log('Previous image button clicked');
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors z-40"
                    style={{ 
                      color: FRENCH_COLORS.blue,
                      border: `1px solid ${FRENCH_COLORS.blue}20`,
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = `${FRENCH_COLORS.blue}10`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage((prev) => (prev + 1) % productImages.length);
                      console.log('Next image button clicked');
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors z-40"
                    style={{ 
                      color: FRENCH_COLORS.blue,
                      border: `1px solid ${FRENCH_COLORS.blue}20`,
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = `${FRENCH_COLORS.blue}10`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};