// store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (userData) =>
        set({
          user: userData,
          isAuthenticated: !!userData,
        }),

      setToken: (token) => set({ token }),

      setAuth: (userData, token) =>
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      // Update user data
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.admin || false;
      },
    }),
    {
      name: "auth-storage", // key untuk localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
