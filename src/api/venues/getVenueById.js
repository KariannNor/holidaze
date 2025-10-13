// src/api/venues/getVenueById.js

import { API_BASE_URL, API_ENDPOINTS, ERROR_MESSAGES } from "../constants";

/**
 * Get a single venue by ID
 * @param {string} id - Venue ID
 * @param {Object} options - Query options
 * @param {boolean} [options.includeOwner] - Include owner details
 * @param {boolean} [options.includeBookings] - Include bookings
 * @returns {Promise<Object>} - Venue data
 */
export const getVenueById = async (id, options = {}) => {
  try {
    // Build query string
    const queryParams = new URLSearchParams();

    if (options.includeOwner) queryParams.append("_owner", "true");
    if (options.includeBookings) queryParams.append("_bookings", "true");

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}${API_ENDPOINTS.VENUE_BY_ID(id)}${
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
      if (response.status === 404) {
        throw new Error(ERROR_MESSAGES.VENUE_NOT_FOUND);
      }
      throw new Error(
        result.errors?.[0]?.message || ERROR_MESSAGES.GENERIC_ERROR
      );
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error fetching venue:", error);
    return {
      success: false,
      error: error.message || ERROR_MESSAGES.GENERIC_ERROR,
    };
  }
};
