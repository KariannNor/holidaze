// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../api/auth/login';
import { registerUser } from '../api/auth/register';
import { logoutUser } from '../api/auth/logout';
import { getUser, getToken, isVenueManager } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();

    if (token && storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      setIsManager(isVenueManager());
    }
    setLoading(false);
  }, []);

  /**
   * Login function
   */
  const login = async (credentials) => {
    const result = await loginUser(credentials);
    
    if (result.success) {
      setUser(result.data);
      setIsAuthenticated(true);
      setIsManager(result.data.venueManager || false);
    }
    
    return result;
  };

  /**
   * Register function
   */
  const register = async (userData) => {
    const result = await registerUser(userData);
    return result;
  };

  /**
   * Logout function
   */
  const logout = () => {
    const result = logoutUser();
    
    if (result.success) {
      setUser(null);
      setIsAuthenticated(false);
      setIsManager(false);
    }
    
    return result;
  };

  /**
   * Update user data (e.g., after avatar update)
   */
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
  };

  const value = {
    user,
    isAuthenticated,
    isManager,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};