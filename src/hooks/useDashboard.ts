// hooks/useDashboard.ts
import { useState, useEffect } from "react";

// Type definitions (same as in your API route)
interface ApiCategory {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  color: string | null;
  current: number;
  previous: number;
}

interface ApiPopularCategory {
  id: string;
  name: string;
  slug: string | null;
  color: string | null;
  articleCount: number;
}

interface ApiTimeline {
  year: string;
  count: number;
}

interface ApiData {
  totalUsers: number;
  totalArticles: number;
  recentArticlesCount: number;
  yearRange: {
    minYear: string;
    maxYear: number;
    currentYear: number;
  };
  growthStats: {
    thisYear: number;
    lastYear: number;
    growthPercentage: number;
  };
  categories: ApiCategory[];
  popularCategories: ApiPopularCategory[];
  articleTimeline: ApiTimeline[];
}

interface ApiResponse {
  success: boolean;
  data: ApiData;
  timestamp: string;
}

interface UseDashboardReturn {
  data: ApiData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
  };
}
