// src/api/profile/getProfile.js

import { API_BASE_URL, API_ENDPOINTS } from "../constants";
import { getAuthHeaders } from "../../utils/storage";

/**
 * Get user profile by name
 * @param {string} username - Username
 * @returns {Promise<Object>} - { success: boolean, data?, error? }
 */
export const getProfile = async (username) => {
  if (!API_BASE_URL || !API_ENDPOINTS?.PROFILE_BY_NAME) {
    return { success: false, error: "API configuration error" };
  }

  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.PROFILE_BY_NAME(username)}`;
    const res = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error:
          data.errors?.[0]?.message ||
          data.message ||
          "Failed to fetch profile",
      };
    }

    return { success: true, data: data.data || data };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
};

/**
 * Get user bookings
 * @param {string} name - Username
 * @returns {Promise<Object>}
 */
export const getProfileBookings = async (name) => {
  if (!API_BASE_URL || !API_ENDPOINTS?.PROFILE_BOOKINGS) {
    return { success: false, error: "API configuration error" };
  }

  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.PROFILE_BOOKINGS(
      name
    )}?_venue=true`;
    const res = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error:
          data.errors?.[0]?.message ||
          data.message ||
          "Failed to fetch bookings",
      };
    }

    return { success: true, data: data.data || data };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
};

/**
 * Get user venues (for venue managers)
 * @param {string} name - Username
 * @returns {Promise<Object>}
 */
export const getProfileVenues = async (name) => {
  if (!API_BASE_URL || !API_ENDPOINTS?.PROFILE_VENUES) {
    return { success: false, error: "API configuration error" };
  }

  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.PROFILE_VENUES(name)}`;
    const res = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error:
          data.errors?.[0]?.message || data.message || "Failed to fetch venues",
      };
    }

    return { success: true, data: data.data || data };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
};
