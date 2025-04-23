import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { FRENCH_COLORS } from '../../constants/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { cart, toggleCart } = useCart();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  // Track scroll for header appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  const headerClasses = `sticky top-0 z-50 w-full transition-all duration-300 ${
    isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'
  }`;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to={ROUTES.HOME}>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center"
          >
            <motion.img 
              src="/logo.png" 
              alt="AnneYelina Cosmetic Logo" 
              className="h-12 mr-3"
              whileHover={{ rotate: 5 }}
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to={ROUTES.HOME} colors={FRENCH_COLORS}>Home</NavLink>
          <NavLink to={ROUTES.PRODUCTS} colors={FRENCH_COLORS}>Products</NavLink>
          <NavLink to={ROUTES.CATEGORIES} colors={FRENCH_COLORS}>Categories</NavLink>
          <NavLink to={ROUTES.ABOUT} colors={FRENCH_COLORS}>About</NavLink>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <motion.button
            className="relative p-2 rounded-full hover:bg-blue-50 transition-colors"
            onClick={() => toggleCart()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open cart"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={FRENCH_COLORS.blue}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            
            {cart.items.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                {cart.items.length}
              </span>
            )}
          </motion.button>
          {user ? (
            <div className="relative profile-menu">
              <motion.button 
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all"
                style={{ 
                  borderColor: FRENCH_COLORS.gray,
                  backgroundColor: FRENCH_COLORS.white
                }}
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                whileHover={{ scale: 1.03, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{ 
                    background: `linear-gradient(135deg, ${FRENCH_COLORS.blue} 0%, ${FRENCH_COLORS.lightBlue} 100%)` 
                  }}
                >
                  {user.profilePic ? (
                    <img 
                      src={`${import.meta.env.VITE_API_URL.split('/api')[0]}${user.profilePic}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user.firstName ? user.firstName.charAt(0) : 'U'}</span>
                  )}
                </motion.div>
                <span 
                  className="text-sm font-medium"
                  style={{ color: FRENCH_COLORS.dark }}
                >
                  {user.firstName || 'User'}
                </span>
                <motion.svg 
                  className="w-4 h-4"
                  animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  fill="none" 
                  stroke={FRENCH_COLORS.dark} 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>
              
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 30,
                      duration: 0.2 
                    }}
                    className="absolute right-0 mt-3 w-64 rounded-xl shadow-xl border overflow-hidden z-50"
                    style={{ 
                      backgroundColor: FRENCH_COLORS.white, 
                      borderColor: FRENCH_COLORS.gray,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Decorative header bar - French flag colors */}
                    <div className="h-1.5 w-full flex">
                      <div className="w-1/3" style={{ backgroundColor: FRENCH_COLORS.blue }}></div>
                      <div className="w-1/3" style={{ backgroundColor: FRENCH_COLORS.white }}></div>
                      <div className="w-1/3" style={{ backgroundColor: FRENCH_COLORS.red }}></div>
                    </div>
                    
                    {/* User info section */}
                    <div className="p-4 border-b flex items-center"
                        style={{ borderColor: 'rgba(141, 153, 174, 0.2)' }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3 overflow-hidden"
                        style={{ 
                          background: `linear-gradient(135deg, ${FRENCH_COLORS.blue} 0%, ${FRENCH_COLORS.lightBlue} 100%)` 
                        }}
                      >
                        {user.profilePic ? (
                          <img 
                            src={`${import.meta.env.VITE_API_URL.split('/api')[0]}${user.profilePic}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{user.firstName ? user.firstName.charAt(0) : 'U'}</span>
                        )}
                      </div>
                      <div>
                        <p 
                          className="text-base font-medium"
                          style={{ color: FRENCH_COLORS.dark }}
                        >
                          {user.firstName} {user.lastName}
                        </p>
                        <p 
                          className="text-xs"
                          style={{ color: FRENCH_COLORS.gray }}
                        >
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    {/* Menu items with enhanced styling */}
                    <div className="py-2">
                      <MenuItemEnhanced to={ROUTES.PROFILE} icon="user" colors={FRENCH_COLORS}>My Profile</MenuItemEnhanced>
                      <MenuItemEnhanced to={ROUTES.ORDERS} icon="shopping-bag" colors={FRENCH_COLORS}>My Orders</MenuItemEnhanced>
                      {user.role === 3 && (
                        <MenuItemEnhanced to={ROUTES.ADMIN.DASHBOARD} icon="shield-check" colors={FRENCH_COLORS}>Admin Dashboard</MenuItemEnhanced>
                      )}
                    </div>
                    
                    {/* Logout section with enhanced styling */}
                    <div 
                      className="mt-2 border-t" 
                      style={{ borderColor: 'rgba(141, 153, 174, 0.2)' }}
                    >
                      <button 
                        onClick={logout} 
                        className="flex items-center w-full px-4 py-3 text-sm transition-all"
                        style={{ 
                          color: FRENCH_COLORS.red,
                          backgroundColor: 'rgba(230, 57, 70, 0.03)'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(230, 57, 70, 0.08)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(230, 57, 70, 0.03)';
                        }}
                      >
                        <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="none" stroke={FRENCH_COLORS.red}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to={ROUTES.LOGIN} 
                  className="px-5 py-2 rounded-full border text-sm font-medium transition-colors"
                  style={{ 
                    borderColor: FRENCH_COLORS.blue, 
                    color: FRENCH_COLORS.blue,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = FRENCH_COLORS.offWhite;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = FRENCH_COLORS.white;
                  }}
                >
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to={ROUTES.REGISTER} 
                  className="text-white px-5 py-2 rounded-full text-sm font-medium transition-all"
                  style={{ backgroundColor: FRENCH_COLORS.red }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#c8343f'; // Darker red
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = FRENCH_COLORS.red;
                  }}
                >
                  Register
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span 
            className="mr-2 text-sm font-medium"
            style={{ color: FRENCH_COLORS.gray }}
          >
            {user ? user.firstName : 'Menu'}
          </span>
          <div className="relative w-10 h-10 flex justify-center items-center">
            <span 
              className={`absolute block w-5 h-0.5 transform transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`}
              style={{ backgroundColor: FRENCH_COLORS.dark }}
            ></span>
            <span 
              className={`absolute block w-5 h-0.5 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
              style={{ backgroundColor: FRENCH_COLORS.dark }}
            ></span>
            <span 
              className={`absolute block w-5 h-0.5 transform transition-transform duration-300 ${isMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`}
              style={{ backgroundColor: FRENCH_COLORS.dark }}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t bg-white"
            style={{ borderColor: FRENCH_COLORS.gray }}
          >
            <div className="container mx-auto px-4 py-3 space-y-1">
              <MobileNavLink to={ROUTES.HOME} colors={FRENCH_COLORS}>Home</MobileNavLink>
              <MobileNavLink to={ROUTES.PRODUCTS} colors={FRENCH_COLORS}>Products</MobileNavLink>
              <MobileNavLink to={ROUTES.CATEGORIES} colors={FRENCH_COLORS}>Categories</MobileNavLink>
              <MobileNavLink to={ROUTES.ABOUT} colors={FRENCH_COLORS}>About</MobileNavLink>
              
              {user ? (
                <>
                  <div 
                    className="pt-2 mt-2 border-t"
                    style={{ borderColor: FRENCH_COLORS.gray }}
                  >
                    <MobileNavLink to={ROUTES.PROFILE} colors={FRENCH_COLORS}>Profile</MobileNavLink>
                    <MobileNavLink to={ROUTES.ORDERS} colors={FRENCH_COLORS}>Orders</MobileNavLink>
                    {user.role === 3 && (
                      <MobileNavLink to={ROUTES.ADMIN.DASHBOARD} colors={FRENCH_COLORS}>Admin Panel</MobileNavLink>
                    )}
                    <button 
                      onClick={logout} 
                      className="flex w-full items-center py-2 hover:text-red-600"
                      style={{ color: FRENCH_COLORS.dark }}
                    >
                      <svg 
                        className="w-5 h-5 mr-3" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke={FRENCH_COLORS.red}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div 
                  className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t"
                  style={{ borderColor: FRENCH_COLORS.gray }}
                >
                  <Link 
                    to={ROUTES.LOGIN} 
                    className="text-center py-2.5 rounded-lg border font-medium text-sm"
                    style={{ 
                      borderColor: FRENCH_COLORS.blue, 
                      color: FRENCH_COLORS.blue 
                    }}
                  >
                    Login
                  </Link>
                  <Link 
                    to={ROUTES.REGISTER} 
                    className="text-center py-2.5 rounded-lg text-white font-medium text-sm"
                    style={{ backgroundColor: FRENCH_COLORS.red }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Cart Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => toggleCart()}
          className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg"
          style={{ backgroundColor: FRENCH_COLORS.blue }}
          aria-label="Open cart"
        >
          <div className="relative">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            
            {cart.items.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                {cart.items.length}
              </span>
            )}
          </div>
        </button>
      </div>
    </header>
  );
};

// Helper components for navigation links
const NavLink = ({ to, children, colors }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link 
      to={to} 
      className={`relative text-sm font-medium transition-colors`}
      style={{ 
        color: isActive ? colors.dark : colors.gray
      }}
      onMouseOver={(e) => {
        if (!isActive) e.currentTarget.style.color = colors.dark;
      }}
      onMouseOut={(e) => {
        if (!isActive) e.currentTarget.style.color = colors.gray;
      }}
    >
      {children}
      {isActive && (
        <motion.div 
          layoutId="navigation-underline"
          className="absolute -bottom-1.5 left-0 w-full h-0.5 rounded-full"
          style={{ 
            background: `linear-gradient(to right, ${colors.blue}, ${colors.red})`
          }}
        />
      )}
    </Link>
  );
};

const MobileNavLink = ({ to, children, colors }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link 
      to={to} 
      className="flex items-center py-2"
      style={{ 
        color: isActive ? colors.blue : colors.dark
      }}
    >
      {isActive && (
        <motion.span 
          layoutId="mobile-nav-dot"
          className="w-1.5 h-1.5 rounded-full mr-2"
          style={{ backgroundColor: colors.blue }}
        />
      )}
      {children}
    </Link>
  );
};

const MenuItemEnhanced = ({ to, children, icon, colors }) => {
  const icons = {
    'user': (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    'shopping-bag': (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    'shield-check': (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  };
  
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      to={to} 
      className="flex items-center px-4 py-3 text-sm transition-all relative" 
      style={{ color: isHovered ? colors.blue : colors.dark }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className="flex items-center justify-center w-8 h-8 rounded-full mr-3"
        animate={{ 
          backgroundColor: isHovered ? `rgba(29, 53, 87, 0.1)` : 'transparent',
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          animate={{ 
            color: isHovered ? colors.blue : colors.gray
          }}
        >
          {icons[icon]}
        </motion.div>
      </motion.div>
      <span className="font-medium">{children}</span>
      
      {isHovered && (
        <motion.div 
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-4"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.blue}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      )}
    </Link>
  );
};