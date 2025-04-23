import { createContext, useContext, useState } from 'react';
import React from 'react';
import { COLORS } from '../constants/colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  
  const theme = {
    colors: COLORS,
    isDark: darkMode,
    toggleDarkMode: () => setDarkMode(!darkMode),
  };

  return React.createElement(
    ThemeContext.Provider,
    { value: theme },
    children
  );
};

export const useTheme = () => useContext(ThemeContext); 