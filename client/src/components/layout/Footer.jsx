import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { FRENCH_COLORS } from '../../constants/theme';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative overflow-hidden">
      {/* Dark gradient background with French-inspired design elements */}
      <div className="absolute inset-0 z-0" style={{ 
        background: `
          linear-gradient(to bottom, #1a1f36, #111827),
          radial-gradient(circle at 15% 50%, ${FRENCH_COLORS.blue}30 0%, transparent 45%),
          radial-gradient(circle at 85% 30%, ${FRENCH_COLORS.red}30 0%, transparent 45%)
        `
      }}>
        {/* Decorative patterns and textures */}
        <div className="absolute inset-0 opacity-5" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        
        {/* Horizontal French flag bar at top */}
        <div className="absolute left-0 right-0 h-3 top-0 flex">
          <div className="w-1/3 bg-blue-600"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-red-600"></div>
        </div>
        
        {/* Animated particle effect */}
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 35%, rgba(59, 130, 246, 0.15) 0%, transparent 12%),
              radial-gradient(circle at 75% 44%, rgba(239, 68, 68, 0.15) 0%, transparent 12%),
              radial-gradient(circle at 46% 60%, rgba(255, 255, 255, 0.08) 0%, transparent 8%)
            `,
            backgroundSize: '120px 120px',
            animation: 'move-bg 60s linear infinite'
          }}
        ></div>
        
        {/* Glowing lines */}
        <div className="absolute left-1/4 -bottom-10 w-0.5 h-48 transform rotate-12 origin-bottom opacity-20 bg-blue-500 blur-sm"></div>
        <div className="absolute right-1/4 -bottom-10 w-0.5 h-32 transform -rotate-12 origin-bottom opacity-20 bg-red-500 blur-sm"></div>
        <div className="absolute left-1/3 -bottom-10 w-0.5 h-40 transform -rotate-6 origin-bottom opacity-10 bg-blue-400 blur-sm"></div>
        <div className="absolute right-1/3 -bottom-10 w-0.5 h-56 transform rotate-6 origin-bottom opacity-10 bg-red-400 blur-sm"></div>
        
        <style jsx="true">{`
          @keyframes move-bg {
            0% { background-position: 0% 0%; }
            100% { background-position: 100% 100%; }
          }
        `}</style>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Column 1: Brand */}
          <div className="md:col-span-5">
            <Link to={ROUTES.HOME}>
              <div className="flex items-center mb-4">
                <img 
                  src="/logo.png" 
                  alt="AnneYelina Cosmetic Logo" 
                  className="h-10 mr-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
                <div>
                  <h2 className="text-xl font-bold text-white">
                    AnneYelina
                  </h2>
                  <span className="block text-xs tracking-wider text-gray-400">COSMETIC</span>
                </div>
              </div>
            </Link>
            
            <div className="p-5 rounded-xl mb-6 max-w-md relative overflow-hidden" 
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
            >
              {/* Left accent border in French blue */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600"></div>
              
              <p className="text-gray-300">
                Experience the elegance of French beauty with our premium cosmetics. 
                Each product is carefully crafted with the finest ingredients to enhance your natural beauty.
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mb-6">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ 
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  transform: 'translateY(0)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.backgroundColor = FRENCH_COLORS.blue;
                  e.currentTarget.style.boxShadow = `0 8px 16px rgba(59, 130, 246, 0.4)`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ 
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  transform: 'translateY(0)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.backgroundColor = FRENCH_COLORS.red;
                  e.currentTarget.style.boxShadow = `0 8px 16px rgba(239, 68, 68, 0.4)`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 3.692c-1.796 0-2.046 0-2.764.04-.714.033-1.18.146-1.606.312-.434.168-.798.41-1.158.773-.37.37-.606.724-.778 1.158-.168.425-.28.908-.31 1.622-.04.755-.04 1.01-.04 2.803s0 2.046.04 2.763c.033.715.146 1.18.312 1.606.168.435.41.799.773 1.158.37.37.724.606 1.158.779.425.167.908.279 1.622.31.755.039 1.01.039 2.803.039s2.046 0 2.763-.04c.715-.033 1.18-.146 1.606-.312.435-.168.799-.41 1.158-.773.37-.37.606-.724.779-1.158.167-.425.279-.908.31-1.622.039-.755.039-1.01.039-2.803s0-2.046-.04-2.763c-.033-.715-.146-1.18-.312-1.606-.168-.435-.41-.799-.773-1.158-.37-.37-.724-.606-1.158-.779-.425-.167-.908-.279-1.622-.31-.755-.039-1.01-.039-2.803-.039zm-1.908 1.984c.758-.039 1.032-.039 2.908-.039s2.15 0 2.908.039c.703.033 1.082.15 1.337.249.321.125.597.292.832.534.242.235.409.511.534.832.098.254.216.634.248 1.336.04.759.04 1.033.04 2.909s0 2.15-.04 2.908c-.032.703-.15 1.083-.248 1.337-.125.321-.292.597-.534.832-.235.242-.511.409-.832.534-.255.098-.634.216-1.337.249-.759.039-1.033.039-2.908.039s-2.15 0-2.908-.039c-.703-.033-1.083-.15-1.337-.249-.321-.125-.597-.292-.832-.534-.242-.235-.409-.511-.534-.832-.098-.254-.216-.634-.249-1.336-.039-.759-.039-1.033-.039-2.909s0-2.15.039-2.908c.033-.703.15-1.083.249-1.337.125-.321.292-.597.534-.832.235-.242.511-.409.832-.534.254-.098.634-.216 1.337-.249z" />
                </svg>
              </a>
              
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ 
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  transform: 'translateY(0)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.backgroundColor = FRENCH_COLORS.blue;
                  e.currentTarget.style.boxShadow = `0 8px 16px rgba(59, 130, 246, 0.4)`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-2">
            <div className="rounded-xl p-5" style={{ 
              background: 'rgba(59, 130, 246, 0.1)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}>
              <h3 className="text-lg font-bold mb-4 text-blue-400">Navigation</h3>
              <ul className="space-y-3">
                <li>
                  <Link to={ROUTES.HOME} className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.PRODUCTS} className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Products
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.CATEGORIES} className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.CONTACT} className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Customer Service */}
          <div className="md:col-span-2">
            <div className="rounded-xl p-5" style={{ 
              background: 'rgba(239, 68, 68, 0.1)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}>
              <h3 className="text-lg font-bold mb-4 text-red-400">Customer Care</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">Shipping Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">Returns & Refunds</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">FAQ</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Column 4: Newsletter */}
          <div className="md:col-span-3">
            <div className="rounded-xl p-5 relative overflow-hidden" 
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}
            >
              {/* Glowing corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20" style={{
                background: `linear-gradient(135deg, transparent 50%, rgba(59, 130, 246, 0.2) 50%)`,
                filter: 'blur(8px)'
              }}></div>
              
              <h3 className="text-lg font-bold mb-4 text-white">Stay Updated</h3>
              <p className="text-gray-300 mb-4">Subscribe to our newsletter for exclusive offers and beauty tips.</p>
              
              <form className="space-y-2">
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-2 rounded-md bg-white/10 backdrop-blur-sm border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full px-4 py-2 rounded-md text-white font-medium transition-all"
                  style={{ 
                    background: `linear-gradient(to right, ${FRENCH_COLORS.blue}, ${FRENCH_COLORS.red})`,
                    boxShadow: `0 4px 12px rgba(0,0,0,0.3)`
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 6px 16px rgba(0,0,0,0.4)`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.3)`;
                  }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom copyright section with glowing separator */}
        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between relative">
          {/* Glowing separator */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px" style={{
            background: `linear-gradient(to right, transparent, ${FRENCH_COLORS.blue}50, ${FRENCH_COLORS.red}50, transparent)`,
            boxShadow: '0 0 8px rgba(255,255,255,0.3)'
          }}></div>
          
          <p className="text-sm text-gray-400">
            &copy; {currentYear} AnneYelina Cosmetic. All rights reserved by Fuchsius.
          </p>
          
          <div className="mt-4 sm:mt-0 flex items-center">
            <div className="flex mr-4">
              <div className="h-6 w-8 rounded-l-sm" style={{ backgroundColor: FRENCH_COLORS.blue, boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}></div>
              <div className="h-6 w-8" style={{ backgroundColor: 'white', boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}></div>
              <div className="h-6 w-8 rounded-r-sm" style={{ backgroundColor: FRENCH_COLORS.red, boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}></div>
            </div>
            <span className="text-sm text-gray-400">Made with ♥ in France</span>
          </div>
        </div>
      </div>
    </footer>
  );
}; 