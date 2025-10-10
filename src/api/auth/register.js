// src/api/auth/register.js

import { API_BASE_URL, API_ENDPOINTS, ERROR_MESSAGES } from "../constants";

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - Username
 * @param {string} userData.email - Email (must end with @stud.noroff.no)
 * @param {string} userData.password - Password (min 8 characters)
 * @param {string} [userData.avatar.url] - Optional avatar URL
 * @param {string} [userData.avatar.alt] - Optional avatar alt text
 * @param {boolean} [userData.venueManager] - Whether user is a venue manager
 * @returns {Promise<Object>} - Registration response with user data
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH_REGISTER}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error messages from API
      if (data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0].message);
      }
      throw new Error(ERROR_MESSAGES.REGISTRATION_FAILED);
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error.message || ERROR_MESSAGES.REGISTRATION_FAILED,
    };
  }
};

/**
 * Validate registration data before sending to API
 * @param {Object} userData - User registration data
 * @returns {Object} - Validation result with errors if any
 */
export const validateRegistration = (userData) => {
  const errors = {};

  // Validate name
  if (!userData.name || userData.name.trim().length === 0) {
    errors.name = "Name is required";
  }

  // Validate email
  if (!userData.email || userData.email.trim().length === 0) {
    errors.email = "Email is required";
  } else if (!userData.email.endsWith("@stud.noroff.no")) {
    errors.email = "Email must end with @stud.noroff.no";
  }

  // Validate password
  if (!userData.password || userData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
