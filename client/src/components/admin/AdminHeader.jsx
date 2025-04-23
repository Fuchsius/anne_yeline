import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

export const AdminHeader = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="bg-white h-16 px-6 flex items-center justify-between border-b border-gray-200">
      {/* Mobile menu button */}
      <button className="md:hidden text-gray-600">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Header title */}
      <h1 className="text-xl font-semibold text-gray-800 md:ml-0 ml-4">{title}</h1>
      
      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center focus:outline-none"
        >
          {user?.profilePic ? (
            <img 
              src={user.profilePic} 
              alt={`${user.firstName} ${user.lastName}`} 
              className="w-8 h-8 rounded-full object-cover mr-2"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-2">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
          )}
          <span className="hidden md:block text-sm text-gray-700">{user?.firstName} {user?.lastName}</span>
          <svg className="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
          >
            <a 
              href={ROUTES.PROFILE} 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
            <a 
              href={ROUTES.HOME} 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
}; 