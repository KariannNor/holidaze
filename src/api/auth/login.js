// src/api/auth/login.js

import { API_BASE_URL, API_ENDPOINTS, ERROR_MESSAGES } from "../constants";
import { saveToken, saveUser } from "../../utils/storage";

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} - Login response with user data and token
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error messages from API
      if (data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0].message);
      }
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Save token and user data to localStorage
    if (data.data.accessToken) {
      saveToken(data.data.accessToken);
    }

    if (data.data) {
      saveUser({
        name: data.data.name,
        email: data.data.email,
        avatar: data.data.avatar,
        venueManager: data.data.venueManager,
        bio: data.data.bio,
      });
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error.message || ERROR_MESSAGES.INVALID_CREDENTIALS,
    };
  }
};

/**
 * Validate login credentials before sending to API
 * @param {Object} credentials - Login credentials
 * @returns {Object} - Validation result with errors if any
 */
export const validateLogin = (credentials) => {
  const errors = {};

  // Validate email
  if (!credentials.email || credentials.email.trim().length === 0) {
    errors.email = "Email is required";
  }

  // Validate password
  if (!credentials.password || credentials.password.length === 0) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
