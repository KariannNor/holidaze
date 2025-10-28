// src/api/profile/updateAvatar.js

import {
  API_BASE_URL,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../constants";
import { getAuthHeaders, saveUser, getUser } from "../../utils/storage";

/**
 * Update user avatar
 * @param {string} name - Username
 * @param {Object} avatarData - Avatar data
 * @param {string} avatarData.url - Avatar URL
 * @param {string} [avatarData.alt] - Avatar alt text
 * @returns {Promise<Object>} - Update response
 */
export const updateAvatar = async (name, avatarData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PROFILE_BY_NAME(name)}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          avatar: avatarData,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.errors?.[0]?.message || ERROR_MESSAGES.GENERIC_ERROR
      );
    }

    // Update user in localStorage
    const currentUser = getUser();
    if (currentUser) {
      saveUser({
        ...currentUser,
        avatar: result.data.avatar,
      });
    }

    return {
      success: true,
      data: result.data,
      message: SUCCESS_MESSAGES.PROFILE_UPDATED,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || ERROR_MESSAGES.GENERIC_ERROR,
    };
  }
};

/**
 * Validate avatar URL
 * @param {string} url - Avatar URL
 * @returns {Object} - Validation result
 */
export const validateAvatarUrl = (url) => {
  const errors = {};

  if (!url || url.trim().length === 0) {
    errors.url = "Avatar URL is required";
    return {
      isValid: false,
      errors,
    };
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch (e) {
    errors.url = "Please enter a valid URL";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
