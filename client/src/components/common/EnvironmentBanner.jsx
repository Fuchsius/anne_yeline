import React from 'react';
import { motion } from 'framer-motion';

export const EnvironmentBanner = () => {
  const env = import.meta.env.VITE_ENV || import.meta.env.MODE;
  const isProd = env === 'production';
  
  // Don't show anything in production
  if (isProd) return null;
  
  // Define the environment color and icon
  const envConfig = {
    development: {
      color: '#3B82F6', // Blue
      bgColor: 'rgba(59, 130, 246, 0.1)', // Light blue
      icon: (
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    staging: {
      color: '#F59E0B', // Amber
      bgColor: 'rgba(245, 158, 11, 0.1)', // Light amber
      icon: (
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    production: {
      color: '#EF4444', // Red
      bgColor: 'rgba(239, 68, 68, 0.1)', // Light red
      icon: (
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };
  
  const config = envConfig[env] || envConfig.development;
  
  return (
    <motion.div 
      initial={{ y: -30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center"
    >
      <div 
        className="px-4 py-1.5 m-2 rounded-full shadow-md flex items-center text-sm font-medium"
        style={{ 
          backgroundColor: config.bgColor,
          color: config.color,
          boxShadow: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
        }}
      >
        {config.icon}
        {env.toUpperCase()} ENVIRONMENT
      </div>
    </motion.div>
  );
}; 