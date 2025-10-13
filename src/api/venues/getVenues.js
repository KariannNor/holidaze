// src/api/venues/getVenues.js

import { API_BASE_URL, API_ENDPOINTS, ERROR_MESSAGES } from "../constants";

/**
 * Get all venues with optional query parameters
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Number of venues to return
 * @param {number} [options.page] - Page number for pagination
 * @param {string} [options.sort] - Sort order
 * @param {boolean} [options.includeOwner] - Include owner details
 * @param {boolean} [options.includeBookings] - Include bookings
 * @returns {Promise<Object>} - Venues data
 */
export const getVenues = async (options = {}) => {
  try {
    // Build query string
    const queryParams = new URLSearchParams();

    if (options.limit) queryParams.append("limit", options.limit);
    if (options.page) queryParams.append("page", options.page);
    if (options.sort) queryParams.append("sort", options.sort);
    if (options.includeOwner) queryParams.append("_owner", "true");
    if (options.includeBookings) queryParams.append("_bookings", "true");

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}${API_ENDPOINTS.VENUES}${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
      meta: result.meta,
    };
  } catch (error) {
    console.error("Error fetching venues:", error);
    return {
      success: false,
      error: error.message || ERROR_MESSAGES.GENERIC_ERROR,
    };
  }
};

/**
 * Search venues by name or location
 * @param {string} query - Search query
 * @returns {Promise<Object>} - Search results
 */
export const searchVenues = async (query) => {
  try {
    const url = `${API_BASE_URL}${
      API_ENDPOINTS.VENUES
    }/search?q=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
    console.error("Error searching venues:", error);
    return {
      success: false,
      error: error.message || ERROR_MESSAGES.GENERIC_ERROR,
    };
  }
};
