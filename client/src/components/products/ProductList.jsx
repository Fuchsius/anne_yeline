import React from 'react';
import { motion } from 'framer-motion';
import { useBackendStatus } from '../../context/BackendStatusProvider';
import { ProductCard } from './ProductCard';

export const ProductList = ({ products, loading, error }) => {
  const { connected } = useBackendStatus();
  
  // Show maintenance message if backend is disconnected
  if (!connected) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md text-center"
      >
        <svg className="h-12 w-12 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">Server Maintenance</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Our server is currently undergoing maintenance. Please check back soon!
        </p>
      </motion.div>
    );
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="my-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="inline-block w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full"
        />
        <p className="mt-2 text-gray-500">Loading products...</p>
      </div>
    );
  }
  
  // Error state (other than disconnection)
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="my-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg text-center"
      >
        <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Oops!</h3>
        <p className="text-red-600 dark:text-red-300">{error.message || 'Something went wrong'}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </motion.div>
    );
  }
  
  // No products
  if (products.length === 0) {
    return (
      <div className="my-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
        <p className="text-gray-600 dark:text-gray-300">No products found in this category.</p>
      </div>
    );
  }
  
  // Products list
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}; 