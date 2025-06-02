import { useAuthStore } from "@/store/authStore";

export function useApiWithAuth() {
  const { token } = useAuthStore();

  const apiCall = async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return { apiCall, token };
}
