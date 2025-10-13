// src/api/profile/getProfile.js

import { API_BASE_URL, API_ENDPOINTS, ERROR_MESSAGES } from "../constants";
import { getAuthHeaders } from "../../utils/storage";

/**
 * Get user profile by name
 * @param {string} name - Username
 * @param {Object} options - Query options
 * @param {boolean} [options.includeBookings] - Include user bookings
 * @param {boolean} [options.includeVenues] - Include user venues (for managers)
 * @returns {Promise<Object>} - Profile data
 */
export const getProfile = async (name, options = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (options.includeBookings) queryParams.append("_bookings", "true");
    if (options.includeVenues) queryParams.append("_venues", "true");

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}${API_ENDPOINTS.PROFILE_BY_NAME(name)}${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.errors?.[0]?.message || ERROR_MESSAGES.GENERIC_ERROR
      );
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return {
      success: false,
      error: error.message || ERROR_MESSAGES.GENERIC_ERROR,
    };
  }
};

/**
 * Get user bookings
 * @param {string} name - Username
 * @returns {Promise<Object>} - Bookings data
 */
export const getProfileBookings = async (name) => {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.PROFILE_BOOKINGS(
      name
    )}?_venue=true`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.errors?.[0]?.message || ERROR_MESSAGES.GENERIC_ERROR
      );
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return {
      success: false,
      error: error.message || ERROR_MESSAGES.GENERIC_ERROR,
    };
  }
};

/**
 * Get user venues (for venue managers)
 * @param {string} name - Username
 * @returns {Promise<Object>} - Venues data
 */
export const getProfileVenues = async (name) => {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.PROFILE_VENUES(
      name
    )}?_bookings=true`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.errors?.[0]?.message || ERROR_MESSAGES.GENERIC_ERROR
      );
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error fetching venues:", error);
    return {
      success: false,
      error: error.message || ERROR_MESSAGES.GENERIC_ERROR,
    };
  }
};
