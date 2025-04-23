import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

// French flag colors
const FRENCH_COLORS = {
  blue: '#0055A4',
  white: '#FFFFFF',
  red: '#EF4135',
  darkBlue: '#00407B',
  lightRed: '#FF6B61',
  lightBlue: '#E6F0FF',
  gray: '#F3F4F6'
};

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || ROUTES.HOME;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);
    
    if (!email || !password) {
      setLocalError('Email and password are required');
      setLoading(false);
      return;
    }
    
    try {
      console.log("Submitting login form...");
      const success = await login(email, password);
      console.log("Login result:", success);
      
      if (success) {
        navigate(from, { replace: true });
      } else {
        setLocalError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error("Login form submission error:", err);
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
        <div className="absolute top-0 left-0 w-full h-2 flex">
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
            Welcome Back
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-2 text-center text-sm text-gray-600"
          >
            Or{' '}
            <Link 
              to={ROUTES.REGISTER} 
              className="font-medium transition-colors duration-200 hover:text-opacity-80"
              style={{ color: FRENCH_COLORS.blue }}
            >
              create a new account
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
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs font-medium hover:underline" style={{ color: FRENCH_COLORS.blue }}>
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200"
                style={{ 
                  backgroundColor: FRENCH_COLORS.lightBlue,
                  borderColor: '#E5E7EB', 
                  focusRing: FRENCH_COLORS.blue
                }}
                placeholder="Your password"
              />
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-lg text-white shadow-lg transition-all duration-300 focus:outline-none"
              style={{ 
                backgroundColor: loading ? '#9CA3AF' : FRENCH_COLORS.blue,
                boxShadow: `0 4px 14px 0 ${FRENCH_COLORS.blue}40` 
              }}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}; 