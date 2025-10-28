// src/api/auth/login.js

import { API_BASE_URL, API_ENDPOINTS } from "../constants";

/**
 * Validate login data
 */
export const validateLogin = (userData) => {
  const errors = {};

  if (!userData.email) {
    errors.email = "Email is required";
  } else if (!userData.email.endsWith("@stud.noroff.no")) {
    errors.email = "Must be a @stud.noroff.no email address";
  }

  if (!userData.password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Login user
 */
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_LOGIN}`, {
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
        error: result.errors?.[0]?.message || result.message || "Login failed",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error occurred during login",
    };
  }
};
