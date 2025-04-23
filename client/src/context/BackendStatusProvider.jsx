import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API } from '../constants/api';

// Create the context
const BackendStatusContext = createContext();

export const useBackendStatus = () => useContext(BackendStatusContext);

export const BackendStatusProvider = ({ children }) => {
  const [status, setStatus] = useState({
    connected: true, // Optimistically assume connected
    checking: true,
    lastChecked: null,
    checkCount: 0
  });

  useEffect(() => {
    // Reduce initial timeout for first check
    const INITIAL_TIMEOUT = 2000; // 2 seconds
    const NORMAL_TIMEOUT = 5000; // 5 seconds
    const CHECK_INTERVAL = 15000; // 15 seconds between checks

    const checkConnection = async () => {
      try {
        const timeout = status.checkCount === 0 ? INITIAL_TIMEOUT : NORMAL_TIMEOUT;
        
        // Use a race promise to handle both success and timeout elegantly
        await Promise.race([
          axios.get(`${API.BASE}/status`),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), timeout)
          )
        ]);
        
        setStatus(prev => ({
          connected: true,
          checking: false,
          lastChecked: new Date(),
          checkCount: prev.checkCount + 1
        }));
      } catch (error) {
        console.error('Backend connection check failed:', error);
        setStatus(prev => ({
          connected: false,
          checking: false,
          lastChecked: new Date(),
          checkCount: prev.checkCount + 1
        }));
      }
    };

    // Initial check with a much shorter delay
    const initialCheck = setTimeout(() => {
      checkConnection();
    }, 300); // Just 300ms initial delay
    
    // Regular interval checks
    const interval = setInterval(checkConnection, CHECK_INTERVAL);
    
    return () => {
      clearTimeout(initialCheck);
      clearInterval(interval);
    };
  }, []);

  return (
    <BackendStatusContext.Provider value={status}>
      {children}
    </BackendStatusContext.Provider>
  );
}; 