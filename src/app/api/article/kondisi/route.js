// app/api/articles/route.js
import { NextResponse } from "next/server";
import { BASE_URL } from "@/lib/api/config";

// GET Method - Mengambil semua artikel
export async function POST(request) {
  try {
    // Ambil body dari request, misalnya mengandung userId
    const body = await request.json();
    const { category, province } = body;

    let url = `${BASE_URL}/articles-by-conditional?`;

    if (category) {
      url += `category=${encodeURIComponent(category)}&`;
    }

    if (province) {
      url += `province=${encodeURIComponent(province)}&`;
    }

    // Hapus karakter '&' atau '?' di akhir jika ada
    url = url.replace(/[&?]$/, "");
    console.log(url)
    const response = await fetch(url);
    const data = await response.json();
    const articles = Array.isArray(data.data?.articles)
      ? data.data.articles
      : [];

    // Format data sesuai dengan struktur yang diinginkan
    const formattedArticles = articles.map((article) => ({
      id: article.id,
      category: article.category,
      title: article.title,
      description: article.description,
      days: Math.floor(
        (new Date() - new Date(article.createdAt)) / (1000 * 60 * 60 * 24)
      ),
      likes: article.likes || 0,
      comments: article.comments || 0,
      image: article.images[0] || "/images/default.png",
      images: article.images || [],
      province: article.province,
      city: article.city,
      active: article.active,
      author: {
        id: article.author?.id || "default-author-id",
        name: article.author?.name || "Unknown Author",
        email: article.author?.email || "unknown@example.com",
      },
    }));

    return NextResponse.json({
      success: true,
      articles: formattedArticles,
      totalCount: formattedArticles.length,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch articles",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
