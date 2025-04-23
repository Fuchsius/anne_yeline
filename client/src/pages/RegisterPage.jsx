import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

// French flag colors
const FRENCH_COLORS = {
  blue: '#0055A4',
  white: '#FFFFFF',
  red: '#EF4135',
  darkBlue: '#00407B',
  lightRed: '#FFF0F0',
  lightBlue: '#E6F0FF',
  gray: '#F3F4F6'
};

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [localError, setLocalError] = useState('');
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear password error when user types in password fields
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      console.log("Submitting registration form...");
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      };
      
      const success = await register(userData);
      console.log("Registration result:", success);
      
      if (success) {
        // Redirect to home page instead of login page since user is now logged in
        navigate(ROUTES.HOME);
      } else {
        setLocalError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error("Registration submission error:", err);
      setLocalError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Combine local and auth errors
  const error = localError || authError;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-blue-600" style={{ backgroundColor: FRENCH_COLORS.blue }}></div>
        <div className="absolute left-1/3 top-0 h-full w-1/3 bg-white"></div>
        <div className="absolute left-2/3 top-0 h-full w-1/3 bg-red-600" style={{ backgroundColor: FRENCH_COLORS.red }}></div>
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl relative overflow-hidden border border-gray-100"
      >
        <div className="absolute top-0 right-0 w-full h-2 flex">
          <div className="w-1/3 h-full" style={{ backgroundColor: FRENCH_COLORS.blue }}></div>
          <div className="w-1/3 h-full bg-white"></div>
          <div className="w-1/3 h-full" style={{ backgroundColor: FRENCH_COLORS.red }}></div>
        </div>
        
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-center text-3xl font-extrabold text-gray-900"
          >
            Create Your Account
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-2 text-center text-sm text-gray-600"
          >
            Or{' '}
            <Link 
              to={ROUTES.LOGIN} 
              className="font-medium transition-colors duration-200 hover:text-opacity-80"
              style={{ color: FRENCH_COLORS.red }}
            >
              sign in to your existing account
            </Link>
          </motion.p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: FRENCH_COLORS.red }}
          >
            {error}
          </motion.div>
        )}
        
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200"
                  style={{ 
                    backgroundColor: FRENCH_COLORS.lightBlue,
                    borderColor: '#E5E7EB', 
                    focusRing: FRENCH_COLORS.blue
                  }}
                  placeholder="First Name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200"
                  style={{ 
                    backgroundColor: FRENCH_COLORS.lightBlue,
                    borderColor: '#E5E7EB', 
                    focusRing: FRENCH_COLORS.blue
                  }}
                  placeholder="Last Name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200"
                style={{ 
                  backgroundColor: FRENCH_COLORS.lightBlue,
                  borderColor: '#E5E7EB', 
                  focusRing: FRENCH_COLORS.blue
                }}
                placeholder="Your email address"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200"
                style={{ 
                  backgroundColor: FRENCH_COLORS.lightRed,
                  borderColor: '#E5E7EB',
                }}
                placeholder="Create a strong password"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200"
                style={{ 
                  backgroundColor: FRENCH_COLORS.lightRed,
                  borderColor: '#E5E7EB',
                }}
                placeholder="Confirm your password"
              />
            </div>
            
            {passwordError && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm p-2 rounded"
                style={{ color: FRENCH_COLORS.red, backgroundColor: FRENCH_COLORS.lightRed }}
              >
                {passwordError}
              </motion.div>
            )}
          </div>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-lg text-white shadow-lg transition-all duration-300 focus:outline-none"
              style={{ 
                backgroundColor: loading ? '#9CA3AF' : FRENCH_COLORS.red,
                boxShadow: `0 4px 14px 0 ${FRENCH_COLORS.red}40` 
              }}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Creating account...' : 'Create account'}
            </motion.button>
          </div>
        </motion.form>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-center text-gray-500 mt-6"
        >
          By creating an account, you agree to our{' '}
          <a href="#" className="font-medium hover:underline" style={{ color: FRENCH_COLORS.blue }}>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="font-medium hover:underline" style={{ color: FRENCH_COLORS.blue }}>
            Privacy Policy
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}; 