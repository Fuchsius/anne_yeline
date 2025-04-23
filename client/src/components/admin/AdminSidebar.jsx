import { motion } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useState } from 'react';

export const AdminSidebar = () => {
  const [expanded, setExpanded] = useState(true);
  
  const navItems = [
    { name: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-7m-6 0L12 3' },
    { name: 'Products', path: ROUTES.ADMIN.PRODUCTS, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'Categories', path: ROUTES.ADMIN.CATEGORIES, icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { name: 'Orders', path: ROUTES.ADMIN.ORDERS, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Users', path: ROUTES.ADMIN.USERS, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  const location = useLocation();

  // Animation variants for sidebar expansion/collapse
  const sidebarVariants = {
    expanded: { width: '260px' },
    collapsed: { width: '80px' }
  };

  // Animation variants for text visibility
  const textVariants = {
    expanded: { opacity: 1, display: 'block' },
    collapsed: { opacity: 0, display: 'none', transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      className="bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen flex-shrink-0 overflow-hidden relative"
      initial="expanded"
      animate={expanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Toggle button */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="absolute -right-3 top-12 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full shadow-lg z-10"
      >
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-0' : 'rotate-180'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center p-5 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <motion.span 
              className="text-xl font-bold text-white tracking-wider"
              variants={textVariants}
            >
              Admin Hub
            </motion.span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="py-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center p-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500' 
                      : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-200'}
                  `}
                >
                  <div className="flex items-center">
                    <svg 
                      className="w-5 h-5 flex-shrink-0" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                    </svg>
                    <motion.span 
                      className="ml-3 font-medium"
                      variants={textVariants}
                    >
                      {item.name}
                    </motion.span>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 mt-auto">
          <div className="flex items-center p-2 rounded-lg hover:bg-gray-700/30 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <motion.span 
              className="ml-3 text-sm font-medium text-gray-300"
              variants={textVariants}
            >
              Logout
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 