import { API_BASE_URL } from "../constants";
import { getAuthHeaders } from "../../utils/storage";

export async function updateVenue(venueId, venueData) {
  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/venues/${venueId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(venueData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.errors?.[0]?.message || "Failed to update venue",
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: "Network error occurred while updating venue",
    };
  }
}
