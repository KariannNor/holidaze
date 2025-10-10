// src/api/constants.js

// Base API URL
export const API_BASE_URL = "https://v2.api.noroff.dev";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGIN: "/auth/login",

  // Venue endpoints
  VENUES: "/holidaze/venues",
  VENUE_BY_ID: (id) => `/holidaze/venues/${id}`,
  VENUE_SEARCH: "/holidaze/venues/search",

  // Booking endpoints
  BOOKINGS: "/holidaze/bookings",
  BOOKING_BY_ID: (id) => `/holidaze/bookings/${id}`,

  // Profile endpoints
  PROFILES: "/holidaze/profiles",
  PROFILE_BY_NAME: (name) => `/holidaze/profiles/${name}`,
  PROFILE_BOOKINGS: (name) => `/holidaze/profiles/${name}/bookings`,
  PROFILE_VENUES: (name) => `/holidaze/profiles/${name}/venues`,
};

// API Query Parameters
export const API_QUERY_PARAMS = {
  INCLUDE_OWNER: "_owner=true",
  INCLUDE_BOOKINGS: "_bookings=true",
  INCLUDE_VENUE: "_venue=true",
  SORT_CREATED: "sort=created",
  SORT_UPDATED: "sort=updated",
  LIMIT: (num) => `limit=${num}`,
  PAGE: (num) => `page=${num}`,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "holidaze_token",
  USER: "holidaze_user",
  VENUE_MANAGER: "holidaze_venue_manager",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  AUTH_REQUIRED: "You must be logged in to perform this action.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  REGISTRATION_FAILED: "Registration failed. Please try again.",
  VENUE_NOT_FOUND: "Venue not found.",
  BOOKING_FAILED: "Failed to create booking. Please try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Successfully logged in!",
  REGISTRATION_SUCCESS: "Account created successfully!",
  BOOKING_SUCCESS: "Booking created successfully!",
  VENUE_CREATED: "Venue created successfully!",
  VENUE_UPDATED: "Venue updated successfully!",
  VENUE_DELETED: "Venue deleted successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
};
