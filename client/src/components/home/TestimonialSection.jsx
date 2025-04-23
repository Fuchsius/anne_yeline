import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FRENCH_COLORS } from '../../constants/theme';

export const TestimonialSection = () => {
  const testimonials = [
    {
      id: 1,
      content: "I've tried many skincare products before, but Fuchisius stands out for its quality and results. My skin has never looked better!",
      author: "Sophie Laurent",
      location: "Paris, France",
      rating: 5,
      image: "/images/testimonials/testimonial-1.jpg" // Update with your image path
    },
    {
      id: 2,
      content: "The attention to detail in these products is remarkable. The fragrances are subtle and elegant, and my sensitive skin loves every product from their collection.",
      author: "Marie Dupont",
      location: "Lyon, France",
      rating: 5,
      image: "/images/testimonials/testimonial-2.jpg"
    },
    {
      id: 3,
      content: "Fuchisius has transformed my skincare routine. Their night cream is a game-changer - I wake up with refreshed, hydrated skin every morning.",
      author: "Emily Johnson",
      location: "New York, USA",
      rating: 5,
      image: "/images/testimonials/testimonial-3.jpg"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);

  const handlePrev = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handleDotClick = (index) => {
    setAutoplay(false);
    setCurrentIndex(index);
  };

  // Default image for testimonials
  const defaultImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        
        {/* Decorative quote marks */}
        <div className="absolute top-20 left-10 opacity-5">
          <svg className="w-40 h-40" viewBox="0 0 24 24" fill={FRENCH_COLORS.blue}>
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        
        <div className="absolute bottom-20 right-10 opacity-5 transform rotate-180">
          <svg className="w-40 h-40" viewBox="0 0 24 24" fill={FRENCH_COLORS.red}>
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        
        {/* French flag-inspired diagonal stripes - very subtle */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute left-0 top-0 h-[200%] w-1/3 -rotate-45" 
            style={{ backgroundColor: FRENCH_COLORS.blue }}>
          </div>
          <div className="absolute left-1/3 top-0 h-[200%] w-1/3 -rotate-45 bg-transparent"></div>
          <div className="absolute left-2/3 top-0 h-[200%] w-1/3 -rotate-45" 
            style={{ backgroundColor: FRENCH_COLORS.red }}>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div 
              className="inline-block px-3 py-1 mb-3 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${FRENCH_COLORS.red}15`, color: FRENCH_COLORS.red }}
            >
              Customer Love
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: FRENCH_COLORS.dark }}>
              What Our Clients Say
            </h2>
            <p className="text-gray-600 md:text-lg">
              Discover the experiences of our valued customers with our French-inspired beauty products.
            </p>
          </motion.div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-white"
            style={{ 
              boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
              minHeight: '400px'
            }}
          >
            {/* Testimonial slider */}
            <div className="grid grid-cols-1 md:grid-cols-5">
              {/* Image column - 2/5 width on desktop */}
              <div className="relative h-64 md:h-auto md:col-span-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`image-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].author}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Failed to load testimonial image for: ${testimonials[currentIndex].author}`);
                        e.target.src = defaultImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-black/50 md:to-transparent"></div>
                    
                    {/* Author info on mobile only */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:hidden">
                      <h3 className="text-white font-bold text-lg">{testimonials[currentIndex].author}</h3>
                      <p className="text-white/80 text-sm">{testimonials[currentIndex].location}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* French flag accent on the left border */}
                <div className="absolute top-0 bottom-0 left-0 w-1 flex flex-col md:flex-row md:top-0 md:bottom-auto md:left-0 md:right-0 md:h-1 md:w-auto z-10">
                  <div className="flex-1 md:flex-none md:w-1/3" style={{ backgroundColor: FRENCH_COLORS.blue }}></div>
                  <div className="flex-1 md:flex-none md:w-1/3 bg-white"></div>
                  <div className="flex-1 md:flex-none md:w-1/3" style={{ backgroundColor: FRENCH_COLORS.red }}></div>
                </div>
              </div>
              
              {/* Content column - 3/5 width on desktop */}
              <div className="p-6 md:p-10 md:col-span-3 flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`content-${currentIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Quote icon */}
                    <div className="mb-4" style={{ color: `${FRENCH_COLORS.blue}40` }}>
                      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    
                    {/* Testimonial content */}
                    <p className="text-lg md:text-xl leading-relaxed mb-6 text-gray-800 italic">
                      "{testimonials[currentIndex].content}"
                    </p>
                    
                    {/* Star rating */}
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className="w-5 h-5 mr-1"
                          viewBox="0 0 24 24"
                          fill={i < testimonials[currentIndex].rating ? FRENCH_COLORS.red : "#D1D5DB"}
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    
                    {/* Author info - desktop only */}
                    <div className="hidden md:block">
                      <h3 className="font-bold text-lg" style={{ color: FRENCH_COLORS.dark }}>
                        {testimonials[currentIndex].author}
                      </h3>
                      <p className="text-gray-500">{testimonials[currentIndex].location}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Navigation controls */}
                <div className="flex justify-between items-center mt-6 pt-6 border-t" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <div className="flex space-x-2">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDotClick(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          idx === currentIndex ? 'w-8 scale-100' : 'bg-gray-300 scale-75'
                        }`}
                        style={{ 
                          backgroundColor: idx === currentIndex ? FRENCH_COLORS.blue : undefined
                        }}
                        aria-label={`Go to testimonial ${idx + 1}`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handlePrev}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                      style={{ 
                        backgroundColor: `${FRENCH_COLORS.blue}10`,
                        color: FRENCH_COLORS.blue
                      }}
                      aria-label="Previous testimonial"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={handleNext}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                      style={{ 
                        backgroundColor: `${FRENCH_COLORS.red}10`,
                        color: FRENCH_COLORS.red
                      }}
                      aria-label="Next testimonial"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 