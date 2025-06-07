import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request) {
  try {
    // Parse request body
    const requestBody = await request.json();

    // Extract articleIds from request body
    const { ids: articleIds, limit = 10, offset = 0 } = requestBody;

    const apiUrl = `${BASE_URL}/articles/bulk`;

    // Set default IDs jika array kosong atau tidak ada
    const defaultIds = [
      "543fe757-e928-4884-bf4d-cd12a5ce69f2",
      "cc101a69-c38e-4bbc-925a-ee004644dc1f",
    ];

    // Handle jika articleIds undefined, null, atau empty array
    const finalIds = (Array.isArray(articleIds) && articleIds.length > 0) 
      ? articleIds 
      : defaultIds;

    // Call external API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: finalIds,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    
    // Extract articles from response
    const articles = Array.isArray(data.data?.articles)
      ? data.data.articles
      : [];

    // Apply pagination
    const paginatedArticles = articles.slice(offset, offset + limit);
    
    // Format data sesuai dengan struktur yang diinginkan
    const formattedArticles = paginatedArticles.map((article) => ({
      id: article.id,
      category: article.category,
      title: article.title,
      description: article.description,
      days: Math.floor(
        (new Date().getTime() - new Date(article.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      ),
      likes: article.likes || 0,
      comments: article.comments || 0,
      image: article.images?.[0] || "/images/default.png",
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
      totalCount: articles.length,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < articles.length,
      },
    });

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