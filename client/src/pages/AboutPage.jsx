import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { FRENCH_COLORS } from '../constants/theme';

export const AboutPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
            Our Story
          </div>
          
          <h1 className="text-4xl font-bold mb-3" style={{ color: FRENCH_COLORS.dark }}>
            About Fuchisius
          </h1>
          
          <div className="w-24 h-1 mx-auto mb-4" 
            style={{ background: `linear-gradient(to right, ${FRENCH_COLORS.blue}, ${FRENCH_COLORS.red})` }}>
          </div>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the passion and heritage behind our French-inspired beauty products.
          </p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Our Story Section */}
          <motion.section 
            variants={itemVariants}
            className="mb-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-10">
                <h2 className="text-2xl font-bold mb-4" style={{ color: FRENCH_COLORS.dark }}>Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Founded in 2020, Fuchisius was born from a passion for French beauty traditions and a desire to make premium cosmetics accessible to everyone.
                </p>
                <p className="text-gray-600 mb-4">
                  Our founder, Anne Marie, spent years studying traditional French skincare methods before bringing her vision to life with a collection that honors these time-tested beauty secrets.
                </p>
                <p className="text-gray-600">
                  Today, we continue to blend the elegance of French cosmetics with modern innovation, creating products that deliver exceptional results while celebrating the rich heritage of French beauty culture.
                </p>
              </div>
              <div className="relative h-64 md:h-auto">
                <div className="absolute inset-0">
                  <img 
                    src="/images/about/our-story.jpg" 
                    alt="Fuchisius cosmetics lab" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-end p-4">
                  <div className="h-1 flex items-center w-32">
                    <div className="w-1/3 h-full bg-blue-600"></div>
                    <div className="w-1/3 h-full bg-white"></div>
                    <div className="w-1/3 h-full bg-red-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
          
          {/* Our Mission */}
          <motion.section 
            variants={itemVariants}
            className="mb-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto md:order-2">
                <div className="absolute inset-0">
                  <img 
                    src="/images/about/our-mission.jpg" 
                    alt="Natural ingredients" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                <div className="absolute top-0 left-0 right-0 flex justify-start p-4">
                  <div className="h-1 flex items-center w-32">
                    <div className="w-1/3 h-full bg-blue-600"></div>
                    <div className="w-1/3 h-full bg-white"></div>
                    <div className="w-1/3 h-full bg-red-600"></div>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-10 md:order-1">
                <h2 className="text-2xl font-bold mb-4" style={{ color: FRENCH_COLORS.dark }}>Our Mission</h2>
                <p className="text-gray-600 mb-4">
                  At Fuchisius, we're committed to creating beauty products that honor the tradition of French cosmetics while embracing sustainable practices.
                </p>
                <p className="text-gray-600 mb-4">
                  We believe that luxury and responsibility can go hand in hand, which is why we source the finest natural ingredients and package our products with the environment in mind.
                </p>
                <p className="text-gray-600">
                  Our mission is to help you look and feel your best while supporting ethical beauty practices and celebrating the timeless elegance of French beauty traditions.
                </p>
              </div>
            </div>
          </motion.section>
          
          {/* Our Values */}
          <motion.section 
            variants={itemVariants}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: FRENCH_COLORS.dark }}>Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quality */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: `${FRENCH_COLORS.blue}15` }}>
                  <svg className="w-6 h-6" style={{ color: FRENCH_COLORS.blue }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: FRENCH_COLORS.dark }}>Quality</h3>
                <p className="text-gray-600">
                  We never compromise on quality, using only the finest ingredients to create products that meet the high standards of French cosmetics.
                </p>
              </div>
              
              {/* Sustainability */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: `${FRENCH_COLORS.red}15` }}>
                  <svg className="w-6 h-6" style={{ color: FRENCH_COLORS.red }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: FRENCH_COLORS.dark }}>Sustainability</h3>
                <p className="text-gray-600">
                  We're committed to minimizing our environmental impact through responsible sourcing, eco-friendly packaging, and sustainable business practices.
                </p>
              </div>
              
              {/* Authenticity */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: `${FRENCH_COLORS.blue}15` }}>
                  <svg className="w-6 h-6" style={{ color: FRENCH_COLORS.blue }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: FRENCH_COLORS.dark }}>Authenticity</h3>
                <p className="text-gray-600">
                  We honor the authentic traditions of French beauty while bringing our own unique perspective to create products that are both timeless and fresh.
                </p>
              </div>
            </div>
          </motion.section>
          
          {/* Our Team */}
          <motion.section 
            variants={itemVariants}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: FRENCH_COLORS.dark }}>Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="h-64 relative">
                  <img 
                    src="team/1.jpg" 
                    alt="Anne Marie - Founder" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-0 left-0 w-full h-1 flex">
                    <div className="w-1/3 h-full bg-blue-600"></div>
                    <div className="w-1/3 h-full bg-white"></div>
                    <div className="w-1/3 h-full bg-red-600"></div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1" style={{ color: FRENCH_COLORS.dark }}>Anne Marie</h3>
                  <p className="text-sm mb-3" style={{ color: FRENCH_COLORS.red }}>Founder & Creative Director</p>
                  <p className="text-gray-600 text-sm">
                    With over 15 years of experience in the beauty industry and a passion for French cosmetics traditions, Anne Marie brings her expertise and vision to every Fuchisius product.
                  </p>
                </div>
              </div>
              
              {/* Team Member 2 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="h-64 relative">
                  <img 
                    src="team/2.jpg" 
                    alt="Jean Pierre - Lead Formulator" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-0 left-0 w-full h-1 flex">
                    <div className="w-1/3 h-full bg-blue-600"></div>
                    <div className="w-1/3 h-full bg-white"></div>
                    <div className="w-1/3 h-full bg-red-600"></div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1" style={{ color: FRENCH_COLORS.dark }}>Jean Pierre</h3>
                  <p className="text-sm mb-3" style={{ color: FRENCH_COLORS.blue }}>Lead Formulator</p>
                  <p className="text-gray-600 text-sm">
                    With a background in cosmetic chemistry and a deep appreciation for natural ingredients, Jean Pierre crafts our innovative formulations with precision and care.
                  </p>
                </div>
              </div>
              
              {/* Team Member 3 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="h-64 relative">
                  <img 
                    src="team/3.jpg" 
                    alt="Sophie - Sustainability Director" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-0 left-0 w-full h-1 flex">
                    <div className="w-1/3 h-full bg-blue-600"></div>
                    <div className="w-1/3 h-full bg-white"></div>
                    <div className="w-1/3 h-full bg-red-600"></div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1" style={{ color: FRENCH_COLORS.dark }}>Sophie</h3>
                  <p className="text-sm mb-3" style={{ color: FRENCH_COLORS.red }}>Sustainability Director</p>
                  <p className="text-gray-600 text-sm">
                    Passionate about responsible beauty, Sophie ensures that our commitment to sustainability is reflected in every aspect of our business, from sourcing to packaging.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
          
          {/* CTA Section */}
          <motion.section 
            variants={itemVariants}
            className="text-center bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: FRENCH_COLORS.dark }}>Experience Fuchisius</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Discover our collection of premium French-inspired cosmetics and experience the difference that quality ingredients and authentic traditions can make.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to={ROUTES.PRODUCTS}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full shadow-md text-white text-sm font-medium transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ 
                  background: `linear-gradient(to right, ${FRENCH_COLORS.blue}, ${FRENCH_COLORS.blue}80)`,
                  boxShadow: `0 4px 14px rgba(0,0,0,0.15)`
                }}
              >
                Shop Now
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link 
                to={ROUTES.CONTACT}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border text-sm font-medium transition-all hover:-translate-y-1 hover:shadow-md"
                style={{ 
                  borderColor: FRENCH_COLORS.red,
                  color: FRENCH_COLORS.red
                }}
              >
                Contact Us
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}; 