// src/api/auth/register.js

import { API_BASE_URL } from "../constants";

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
    const response = await fetch(`${API_BASE_URL}/holidaze/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": process.env.REACT_APP_API_KEY,
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.errors?.[0]?.message || "Registration failed",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error occurred during registration",
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

  if (!userData.name || userData.name.length < 1) {
    errors.name = "Username is required";
  }

  if (!userData.email) {
    errors.email = "Email is required";
  } else if (!userData.email.includes("@stud.noroff.no")) {
    errors.email = "Must be a @stud.noroff.no email address";
  }

  if (!userData.password || userData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
