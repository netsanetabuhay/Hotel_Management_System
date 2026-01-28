import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services';
import { USER_ROLES } from '../utils/constants';
import { hasPermission, canAccessModule } from '../utils/roleHelpers';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        const { token, user: userData } = response.data;
        
        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        return { success: true, data: userData };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err?.message || 'An error occurred during login';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        const { token, user: userData } = response.data;
        
        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        return { success: true, data: userData };
      } else {
        setError(response.message || 'Registration failed');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err?.message || 'An error occurred during registration';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
    
    // Call logout API if needed
    authService.logout().catch(console.error);
  }, []);

  // Update user function
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Check permission wrapper
  const checkPermission = (module, action) => {
    if (!user) return false;
    return hasPermission(user.role, module, action);
  };

  // Check module access wrapper
  const checkModuleAccess = (module) => {
    if (!user) return false;
    return canAccessModule(user.role, module);
  };

  // Check if user is admin
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  // Check if user is manager or admin
  const isManagerOrAdmin = [USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(user?.role);

  // Check if user is staff (any role except guest)
  const isStaff = user?.role && user.role !== 'guest';

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin,
    isManagerOrAdmin,
    isStaff,
    login,
    register,
    logout,
    updateUser,
    checkPermission,
    checkModuleAccess,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;