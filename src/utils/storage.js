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
    // Check if item exists and is not null/undefined
    if (item === null || item === undefined || item === "undefined") {
      return null;
    }
    return JSON.parse(item);
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
    return true;
  } catch (error) {
    console.error("Error removing from localStorage:", error);
    return false;
  }
};

/**
 * Clear all app data from localStorage
 */
export const clearStorage = () => {
  removeFromStorage(STORAGE_KEYS.TOKEN);
  removeFromStorage(STORAGE_KEYS.USER);
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
  return saveToStorage(STORAGE_KEYS.TOKEN, token);
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
  return saveToStorage(STORAGE_KEYS.USER, user);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

/**
 * Check if user is a venue manager
 */
export const isVenueManager = () => {
  const user = getUser();
  return user?.venueManager || false;
};

/**
 * Get API headers with authentication
 */
export const getAuthHeaders = () => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": process.env.REACT_APP_API_KEY,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};
