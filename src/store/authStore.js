// store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
const BASE_URL = process.env.NEXT_PUBLIC_API_MODEL_BASE_URL || "";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      artikel: null, // Menyimpan ID artikel
      recommendations: [], // Menyimpan array ID artikel rekomendasi
      isLoadingRecommendations: false,

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
      // Artikel actions dengan API call
      setArtikel: async (artikelId) => {
        set({
          artikel: artikelId,
          isLoadingRecommendations: true,
          recommendations: [],
        });

        try {
          
          const response = await fetch(`${BASE_URL}/recommend`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              article_id: artikelId,
              top_n: 10,
              include_metadata: true,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          // Simpan hanya ID artikel dari recommendations
          const recommendationIds = data.recommendations.map((rec) => rec.id);

          set({
            recommendations: recommendationIds,
            isLoadingRecommendations: false,
          });

          console.log("Recommendations loaded:", recommendationIds);
        } catch (error) {
          console.error("Error fetching recommendations:", error);
          set({
            recommendations: [],
            isLoadingRecommendations: false,
          });
        }
      },

      clearArtikel: () =>
        set({
          artikel: null,
          recommendations: [],
          isLoadingRecommendations: false,
        }),

      // Get recommendations
      getRecommendations: () => {
        const { recommendations } = get();
        return recommendations;
      },
    }),
    {
      name: "auth-storage", // key untuk localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        artikel: state.artikel,
        recommendations: state.recommendations, // Persist recommendations
      }),
    }
  )
);
