import { createContext, useContext, useState, useEffect, useRef } from 'react';
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

  // Throttle refreshes to avoid rapid repeated API calls
  const lastRefreshRef = useRef(0);
  const REFRESH_THROTTLE_MS = 3000; // increased to 3s

  // Initialize auth state
  useEffect(() => {
    const token = getToken();
    const userData = getUser();
    
    if (token && userData && typeof userData === 'object') {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      clearStorage();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Add refreshUser function
  const refreshUser = async () => {
    const now = Date.now();
    if (now - lastRefreshRef.current < REFRESH_THROTTLE_MS) {
      return { success: false, error: 'Throttled' };
    }
    lastRefreshRef.current = now;

    const token = getToken();
    const userData = getUser();
    
    if (token && userData?.name) {
      try {
        const result = await getProfile(userData.name);
        if (result.success) {
          const updatedUser = result.data;
          setUser(updatedUser);
          saveUser(updatedUser);
          return { success: true, data: updatedUser };
        } else {
          return { success: false, error: result.error };
        }
      } catch (error) {
        return { success: false, error: 'Network error occurred' };
      }
    }
    return { success: false, error: 'No user data to refresh' };
  };

  const login = (userData, token) => {
    if (userData && token) {
      saveToken(token);
      saveUser(userData);
      setUser(userData);
      setIsAuthenticated(true);
    }
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
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};