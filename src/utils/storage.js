// src/utils/storage.js

import { STORAGE_KEYS } from "../api/constants";

/**
 * Save data to localStorage
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

/**
 * Get data from localStorage
 */
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

/**
 * Remove data from localStorage
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
};

/**
 * Clear all app data from localStorage
 */
export const clearStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

/**
 * Get authentication token
 */
export const getToken = () => {
  return getFromStorage(STORAGE_KEYS.TOKEN);
};

/**
 * Save authentication token
 */
export const saveToken = (token) => {
  saveToStorage(STORAGE_KEYS.TOKEN, token);
};

/**
 * Get user data
 */
export const getUser = () => {
  return getFromStorage(STORAGE_KEYS.USER);
};

/**
 * Save user data
 */
export const saveUser = (user) => {
  saveToStorage(STORAGE_KEYS.USER, user);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Check if user is a venue manager
 */
export const isVenueManager = () => {
  const user = getUser();
  return user?.venueManager === true;
};

/**
 * Get API headers with authentication
 */
export const getAuthHeaders = () => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};
