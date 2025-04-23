import React from 'react';
import { motion } from 'framer-motion';
import { useBackendStatus } from '../../context/BackendStatusProvider';

export const MaintenanceOverlay = () => {
  const { connected, checking } = useBackendStatus();

  // Don't show anything if backend is connected or still checking
  if (connected || checking) {
    return null;
  }

  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100 dark:border-gray-700"
        initial={{ y: 20, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="text-center">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <motion.div 
              className="absolute inset-0 rounded-full bg-red-100 dark:bg-red-900/30"
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.9, 0.7] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            >
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </motion.div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">We'll be back soon!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Our server is currently undergoing maintenance to improve your experience. 
            We apologize for any inconvenience and will be back online shortly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
            >
              Go Back
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      <div className="absolute bottom-4 text-center w-full text-gray-400 text-sm">
        Status: Server Maintenance in Progress
      </div>
    </motion.div>
  );
}; 