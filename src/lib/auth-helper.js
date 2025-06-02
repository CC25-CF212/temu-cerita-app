// /lib/auth-helper.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth.bck";

/**
 * Get the session on the server side in App Router
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Helper function to make authenticated fetch requests
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @param {object} session - Session object (optional, will be fetched if not provided)
 * @returns {Promise<Response>} - Fetch response
 */
export async function fetchWithAuth(url, options = {}, session = null) {
  // If no session is provided, get it
  if (!session) {
    session = await getSession();
  }

  // If there's still no session, throw an error
  if (!session) {
    throw new Error("No authentication session found");
  }

  // Add authorization header with the token from the session
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    Authorization: `Bearer ${session.user.apiToken}`,
  };

  // Make the request
  return fetch(url, {
    ...options,
    headers,
  });
}
