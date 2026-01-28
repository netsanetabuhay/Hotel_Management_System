import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext({});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedSidebarState = localStorage.getItem('sidebarCollapsed') === 'true';
    
    setTheme(savedTheme);
    setSidebarCollapsed(savedSidebarState);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Set specific theme
  const setThemeMode = (mode) => {
    if (['light', 'dark'].includes(mode)) {
      setTheme(mode);
      localStorage.setItem('theme', mode);
      document.documentElement.setAttribute('data-theme', mode);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };

  // Set sidebar state
  const setSidebarState = (state) => {
    setSidebarCollapsed(state);
    localStorage.setItem('sidebarCollapsed', state.toString());
  };

  const value = {
    theme,
    sidebarCollapsed,
    toggleTheme,
    setThemeMode,
    toggleSidebar,
    setSidebarState,
    isDarkMode: theme === 'dark',
    isLightMode: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;