import { useState } from 'react';
import { motion } from 'framer-motion';
import { FRENCH_COLORS } from '../../constants/theme';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      setLoading(false);
      return;
    }
    
    // Simulate API call
    try {
      // Replace with actual API call when ready
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus({ 
        type: 'success', 
        message: 'Thank you for subscribing! Check your inbox for a welcome gift.' 
      });
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus({ 
        type: 'error', 
        message: 'Something went wrong. Please try again later.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background pattern with French-inspired design */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0"
          style={{ 
            background: `linear-gradient(135deg, ${FRENCH_COLORS.blue}08 0%, transparent 50%), 
                         linear-gradient(225deg, ${FRENCH_COLORS.red}08 0%, transparent 50%),
                         #ffffff` 
          }}
        />
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${FRENCH_COLORS.blue} 0.5%, transparent 0.5%),
                              radial-gradient(circle at 80% 70%, ${FRENCH_COLORS.red} 0.5%, transparent 0.5%)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* French flag accent */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="w-1/3 bg-blue-600"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-red-600"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
          <div className="w-1/3 bg-blue-600"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-red-600"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl"
          style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left content - newsletter signup */}
            <div className="p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div 
                  className="inline-block px-3 py-1 mb-4 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${FRENCH_COLORS.blue}15`, color: FRENCH_COLORS.blue }}
                >
                  Stay Connected
                </div>
                <h2 className="text-3xl font-bold mb-4" style={{ color: FRENCH_COLORS.dark }}>
                  Subscribe to Our Newsletter
                </h2>
                <p className="text-gray-600 mb-6">
                  Join our community to receive the latest updates, exclusive offers, and beauty tips directly to your inbox.
                </p>
                
                {/* Subscription form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-offset-2 transition-all"
                        style={{ 
                          borderColor: 'rgba(0,0,0,0.1)',
                          focusRing: FRENCH_COLORS.blue
                        }}
                        placeholder="Your email address"
                        disabled={loading}
                        required
                      />
                      {loading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Status message */}
                  {status.message && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 mb-4 rounded-md text-sm ${
                        status.type === 'success' 
                          ? 'bg-green-50 text-green-800' 
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {status.message}
                    </motion.div>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-lg text-white font-medium transition-all"
                    style={{ 
                      background: loading 
                        ? 'rgba(0,0,0,0.2)' 
                        : `linear-gradient(to right, ${FRENCH_COLORS.blue}, ${FRENCH_COLORS.blue}D0)`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  >
                    {loading ? 'Subscribing...' : 'Subscribe Now'}
                  </motion.button>
                  
                  <p className="text-xs text-gray-500 mt-3">
                    By subscribing, you agree to receive marketing communications from us. 
                    You can unsubscribe at any time.
                  </p>
                </form>
              </motion.div>
            </div>
            
            {/* Right content - decorative elements */}
            <div className="relative hidden md:block">
              {/* Background image */}
              <div className="absolute inset-0">
                <img 
                  src="/images/newsletter-background.jpg" 
                  alt="Beauty products arrangement"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Failed to load newsletter background image");
                    e.target.src = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-red-900/70 mix-blend-multiply"></div>
              </div>
              
              {/* Content over the image */}
              <div className="absolute inset-0 p-12 flex flex-col justify-center">
                <div className="max-w-xs text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-white/20 backdrop-blur-sm p-1 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Subscriber Benefits</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Exclusive offers and discounts</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Early access to new products</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>French beauty tips and tutorials</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Seasonal gift guides and recommendations</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>
              
              {/* French flag accent on right edge */}
              <div className="absolute top-0 bottom-0 right-0 w-1 flex flex-col">
                <div className="flex-1" style={{ backgroundColor: FRENCH_COLORS.blue }}></div>
                <div className="flex-1 bg-white"></div>
                <div className="flex-1" style={{ backgroundColor: FRENCH_COLORS.red }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 