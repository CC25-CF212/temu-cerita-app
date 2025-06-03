import { ArticlesResponse, ArticlesParams } from "./types";

export async function getArticles(
  params: ArticlesParams = {}
): Promise<ArticlesResponse> {
  const searchParams = new URLSearchParams();

  // Set default values
  searchParams.append("page", params.page || "1");
  searchParams.append("limit", params.limit || "10");

  // Add optional parameters
  if (params.category) searchParams.append("category", params.category);
  if (params.province) searchParams.append("province", params.province);
  if (params.city) searchParams.append("city", params.city);

  const response = await fetch(`/api/articles?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.status}`);
  }

  return response.json();
}
