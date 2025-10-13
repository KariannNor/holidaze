// src/api/venues/createVenue.js

import {
  API_BASE_URL,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../constants";
import { getAuthHeaders } from "../../utils/storage";

/**
 * Create a new venue
 * @param {Object} venueData - Venue data
 * @returns {Promise<Object>} - Create response
 */
export const createVenue = async (venueData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.VENUES}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(venueData),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(ERROR_MESSAGES.AUTH_REQUIRED);
      }
      throw new Error(
        result.errors?.[0]?.message || ERROR_MESSAGES.GENERIC_ERROR
      );
    }

    return {
      success: true,
      data: result.data,
      message: SUCCESS_MESSAGES.VENUE_CREATED,
    };
  } catch (error) {
    console.error("Error creating venue:", error);
    return {
      success: false,
      error: error.message || ERROR_MESSAGES.GENERIC_ERROR,
    };
  }
};

/**
 * Validate venue data
 * @param {Object} venueData - Venue data to validate
 * @returns {Object} - Validation result
 */
export const validateVenue = (venueData) => {
  const errors = {};

  // Required fields
  if (!venueData.name || venueData.name.trim().length === 0) {
    errors.name = "Venue name is required";
  }

  if (!venueData.description || venueData.description.trim().length === 0) {
    errors.description = "Description is required";
  }

  if (!venueData.price || venueData.price < 0) {
    errors.price = "Price must be 0 or greater";
  }

  if (!venueData.maxGuests || venueData.maxGuests < 1) {
    errors.maxGuests = "At least 1 guest must be allowed";
  }

  // Validate media URLs if provided
  if (venueData.media && venueData.media.length > 0) {
    venueData.media.forEach((mediaItem, index) => {
      if (mediaItem.url) {
        try {
          new URL(mediaItem.url);
        } catch (e) {
          errors[`media_${index}`] = `Image ${index + 1} must be a valid URL`;
        }
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
