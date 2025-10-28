// src/api/auth/logout.js

import { clearStorage } from "../../utils/storage";

/**
 * Logout user by clearing all stored data
 * @returns {Object} - Logout success response
 */
export const logoutUser = () => {
  try {
    // Clear all authentication data from localStorage
    clearStorage();

    return {
      success: true,
      message: "Successfully logged out",
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to logout. Please try again.",
    };
  }
};
