// app/api/articles/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://your-api-domain.com";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Ambil semua query parameters
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const category = searchParams.get("category");
    const province = searchParams.get("province");
    const city = searchParams.get("city");

    // Build query string dinamis
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);

    if (category) queryParams.append("category", category);
    if (province) queryParams.append("province", province);
    if (city) queryParams.append("city", city);

    // Call external API
    const response = await fetch(
      `${BASE_URL}/articles?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Tambahkan header auth jika diperlukan
          // 'Authorization': `Bearer ${process.env.API_TOKEN}`,
        },
        // Cache strategy - sesuaikan dengan kebutuhan
        next: { revalidate: 60 }, // revalidate setiap 60 detik
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch articles",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
