// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, saveToken, saveUser, getUser, clearStorage } from '../utils/storage';
import { getProfile } from '../api/profile/getProfile';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isManager = user?.venueManager || false;

  // Initialize auth state
  useEffect(() => {
    const token = getToken();
    const userData = getUser();
    
    if (token && userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  // Add refreshUser function
  const refreshUser = async () => {
    const token = getToken();
    const userData = getUser();
    
    if (token && userData?.name) {
      try {
        const result = await getProfile(userData.name);
        if (result.success) {
          const updatedUser = result.data;
          setUser(updatedUser);
          saveUser(updatedUser);
          console.log('User data refreshed:', updatedUser); // Debug log
          return { success: true, data: updatedUser };
        } else {
          console.error('Failed to refresh user data:', result.error);
          return { success: false, error: result.error };
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
        return { success: false, error: 'Network error occurred' };
      }
    }
    return { success: false, error: 'No user data to refresh' };
  };

  const login = (userData, token) => {
    saveToken(token);
    saveUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearStorage();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isManager,
    login,
    logout,
    refreshUser, // Add refreshUser to context
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};