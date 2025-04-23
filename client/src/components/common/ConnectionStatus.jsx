import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API } from '../../constants/api';

export const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking');
  const [backendInfo, setBackendInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isProd = import.meta.env.MODE === 'production';

  useEffect(() => {
    // Only show in development mode
    if (isProd) return;

    const checkConnection = async () => {
      try {
        // Make a lightweight request to check connection
        const startTime = Date.now();
        const response = await axios.get(`${API.BASE}/status`, { timeout: 5000 });
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        setStatus('connected');
        setBackendInfo({
          version: response.data.version || 'unknown',
          environment: response.data.environment || 'unknown',
          latency: `${latency}ms`
        });
      } catch (error) {
        console.error('Backend connection check failed:', error);
        setStatus('disconnected');
      }
    };

    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, [isProd]);

  // Don't render anything in production
  if (isProd) return null;

  const getStatusColor = () => {
    switch(status) {
      case 'connected': return '#10B981'; // Green
      case 'disconnected': return '#EF4444'; // Red
      default: return '#F59E0B'; // Yellow/amber
    }
  };

  return (
    <motion.div 
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <motion.div
        whileHover={{ scale: isExpanded ? 1 : 1.05 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer flex items-center bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ 
          borderLeft: `4px solid ${getStatusColor()}`,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div className="p-3 px-4">
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-3"
              style={{ backgroundColor: getStatusColor() }}
            />
            <div className="font-medium text-gray-800">
              {status === 'connected' 
                ? 'Connected to Backend' 
                : status === 'disconnected' 
                  ? 'Backend Disconnected' 
                  : 'Checking Connection...'}
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && status === 'connected' && backendInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 pt-2 border-t border-gray-100"
              >
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>API Version:</span>
                  </div>
                  <div className="font-medium text-gray-700">{backendInfo.version}</div>
                  
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Environment:</span>
                  </div>
                  <div className="font-medium text-gray-700">{backendInfo.environment}</div>
                  
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Latency:</span>
                  </div>
                  <div className="font-medium text-gray-700">{backendInfo.latency}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}; 