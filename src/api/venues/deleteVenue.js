import { API_BASE_URL } from "../constants";

export async function deleteVenue(venueId) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return { success: false, error: "No access token found" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/holidaze/venues/${venueId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": process.env.REACT_APP_API_KEY,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return {
        success: false,
        error: result.errors?.[0]?.message || "Failed to delete venue",
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Network error occurred while deleting venue",
    };
  }
}
