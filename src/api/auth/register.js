// src/api/auth/register.js

import { API_BASE_URL, API_ENDPOINTS } from "../constants";

/**
 * Validate registration data before sending to API
 */
export const validateRegistration = (userData) => {
  const errors = {};

  if (!userData.name || userData.name.length < 1) {
    errors.name = "Username is required";
  }

  if (!userData.email) {
    errors.email = "Email is required";
  } else if (!userData.email.endsWith("@stud.noroff.no")) {
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

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH_REGISTER}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error("Registration error response:", result);
      }
      return {
        success: false,
        error:
          result.errors?.[0]?.message ||
          result.message ||
          "Registration failed",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Registration network error:", error);
    }
    return {
      success: false,
      error: "Network error occurred during registration",
    };
  }
};
