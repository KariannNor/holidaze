// src/api/bookings/createBooking.js

import { API_BASE_URL, API_ENDPOINTS, ERROR_MESSAGES } from "../constants";
import { getAuthHeaders } from "../../utils/storage";

/**
 * Create a new booking
 * @param {Object} bookingData - Booking data
 * @param {string} bookingData.venueId - Venue ID
 * @param {string} bookingData.dateFrom - Start date (ISO 8601)
 * @param {string} bookingData.dateTo - End date (ISO 8601)
 * @param {number} bookingData.guests - Number of guests
 * @returns {Promise<Object>} - Booking response
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BOOKINGS}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(ERROR_MESSAGES.AUTH_REQUIRED);
      }
      throw new Error(
        result.errors?.[0]?.message || ERROR_MESSAGES.BOOKING_FAILED
      );
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      error: error.message || ERROR_MESSAGES.BOOKING_FAILED,
    };
  }
};

/**
 * Validate booking data
 * @param {Object} bookingData - Booking data to validate
 * @returns {Object} - Validation result
 */
export const validateBooking = (bookingData) => {
  const errors = {};

  if (!bookingData.dateFrom) {
    errors.dateFrom = "Check-in date is required";
  }

  if (!bookingData.dateTo) {
    errors.dateTo = "Check-out date is required";
  }

  if (bookingData.dateFrom && bookingData.dateTo) {
    const from = new Date(bookingData.dateFrom);
    const to = new Date(bookingData.dateTo);

    if (from >= to) {
      errors.dateTo = "Check-out must be after check-in";
    }

    if (from < new Date()) {
      errors.dateFrom = "Check-in date cannot be in the past";
    }
  }

  if (!bookingData.guests || bookingData.guests < 1) {
    errors.guests = "At least 1 guest is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
