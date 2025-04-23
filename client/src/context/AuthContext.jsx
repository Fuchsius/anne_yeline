import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../constants/api';
import React from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(API.AUTH.VERIFY_TOKEN, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      console.log("Attempting login to:", API.AUTH.LOGIN);
      console.log("Login data:", { email, password: '******' });
      
      const response = await axios.post(API.AUTH.LOGIN, { email, password });
      console.log("Login response:", response.data);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
        return true;
      } else {
        console.error("Login response missing token:", response.data);
        setError("Invalid login response from server");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(error.response?.data?.error || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      console.log("Attempting registration at:", API.AUTH.REGISTER);
      console.log("Registration data:", { ...userData, password: '******' });
      
      const response = await axios.post(API.AUTH.REGISTER, userData);
      console.log("Registration response:", response.data);
      
      if (response.data && response.data.token) {
        // Automatically log the user in by storing the token
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
        return true;
      } else {
        console.error("Registration response missing token:", response.data);
        setError("Invalid registration response from server");
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Use React.createElement instead of JSX
  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, error, login, register, logout, isAdmin: user?.role === 3 } },
    children
  );
};

export const useAuth = () => useContext(AuthContext); 