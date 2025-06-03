// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";

// Type definitions
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

export async function GET(request: NextRequest) {
  try {
    // Get base URL from environment variable
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "NEXT_PUBLIC_API_URL environment variable is not configured",
        },
        { status: 500 }
      );
    }

    // Call the external API
    const response = await fetch(`${baseUrl}/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any required headers here (e.g., Authorization)
        // 'Authorization': `Bearer ${token}`,
      },
      // Add cache control if needed
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Dashboard API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
