
import { useState, useCallback, useRef } from "react";


export async function staticArticlesByCategory(category, options = {}) {
  const { page = 1, limit = 100 } = options;
  try {
    const url = new URL("/api/article", window.location.origin);
    if (category) url.searchParams.set("category", category);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("limit", limit.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      articles: data.articles || [],
      hasMore: data.hasMore || false,
      totalCount: data.totalCount || 0,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      articles: [],
      hasMore: false,
      totalCount: 0,
      currentPage: page,
    };
  }
}

export async function generateLocationArticles(locationData, options = {}) {
  const { page = 1, limit = 100 } = options;
  try {
    const cityName = locationData?.city || "Unknown";
    const district = locationData?.district || "";

    // const url = new URL("/api/article", window.location.origin);
    // url.searchParams.set("city", cityName);
    // url.searchParams.set("page", page);
    // url.searchParams.set("limit", limit);

    // const response = await fetch(url.toString());
    const response = await fetch("/api/article/kondisi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ province: cityName}),
  });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const allArticles = data.articles || [];
    return {
      articles: allArticles || [],
      hasMore: data.hasMore || false,
      totalCount: allArticles.length,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching location articles:", error);
    return {
      articles: [],
      hasMore: false,
      totalCount: 0,
      currentPage: page,
    };
  }
}

export async function getArtikeRekomendasi(options = {}) {
  const { page = 1, limit = 100, ids = [] } = options;
  try {
    const response = await fetch("/api/articles/rekomendasi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: ids,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      articles: data.articles || [],
      hasMore: data.hasMore || false,
      totalCount: data.totalCount || 0,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      articles: [],
      hasMore: false,
      totalCount: 0,
      currentPage: page,
    };
  }
}
export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(false);
  // Static articles untuk fallback
  const staticArticlesByCategoryOld = {
    "For You": [
      {
        id: 1,
        category: "Google Cloud - Community",
        title: "When did your data REALLY arrive in BigQuery?",
        description:
          "A short guide on capturing data ingestion time in BigQuery",
        days: 2,
        likes: 45,
        comments: 5,
        image: "/images/gambar.png",
      },
      {
        id: 2,
        category: "Machine Learning",
        title: "Real-time Location-based Content Recommendation",
        description:
          "How ML algorithms personalize content based on user location",
        days: 1,
        likes: 78,
        comments: 12,
        image: "/images/gambar.png",
      },
    ],
    "All Article": [
      {
        id: 4,
        category: "Web Development",
        title: "Building Location-aware Applications with JavaScript",
        description: "Implementing real-time geolocation features in web apps",
        days: 3,
        likes: 124,
        comments: 18,
        image: "/images/gambar.png",
      },
      {
        id: 5,
        category: "Software Architecture",
        title: "Microservices for Location-based Services",
        description:
          "Scalable architecture patterns for geo-spatial applications",
        days: 5,
        likes: 156,
        comments: 25,
        image: "/images/gambar.png",
      },
    ],
  };

  // ✅ SIMPLIFIED: fetchArticles with cleaner dependencies
  const fetchArticles = useCallback(
    async (
      activeTab,
      location = null,
      ids = [],
      pageNum = 1,
      append = false
    ) => {
      if (loadingRef.current) {
        console.log("⏳ Fetch already in progress, skipping...");
        return;
      }

      console.log(
        `🚀 Fetching articles for ${activeTab}, page ${pageNum}, append: ${append}`
      );

      loadingRef.current = true;
      setLoading(true);

      try {
        let apiResponse = null;
        if (activeTab === "Regional Exploration" && location) {
          apiResponse = await generateLocationArticles(location, {
            page: pageNum,
            limit: 100,
          });
        } else if (activeTab === "For You") {
          apiResponse = await getArtikeRekomendasi({
            ids: ids, 
            page: pageNum,
            limit: 100,
          });
        } else if (activeTab === "All Article") {
          apiResponse = await staticArticlesByCategory("", {
            page: pageNum,
            limit: 100,
          });
        } else {
          // Fallback for other tabs - simulate pagination
          const baseArticles = staticArticlesByCategoryOld[activeTab] || [];
          const articlesPerPage = 5;
          const startIndex = (pageNum - 1) * articlesPerPage;

          const allArticles = [];
          for (let i = 0; i < 20; i++) {
            baseArticles.forEach((article, index) => {
              allArticles.push({
                ...article,
                id: article.id + i * 100 + index,
                title: `${article.title} - Part ${i + 1}`,
                likes: article.likes + Math.floor(Math.random() * 50),
              });
            });
          }

          const newArticles = allArticles.slice(
            startIndex,
            startIndex + articlesPerPage
          );
          apiResponse = {
            articles: newArticles,
            hasMore: startIndex + articlesPerPage < allArticles.length,
            totalCount: allArticles.length,
            currentPage: pageNum,
          };
        }

        // Handle API response
        let newArticles = apiResponse?.articles || [];
        let apiHasMore = apiResponse?.hasMore || false;

        // Fallback to static if API returns empty
        if (newArticles.length === 0 && pageNum === 1) {
          const fallbackArticles = staticArticlesByCategoryOld[activeTab] || [];
          newArticles = fallbackArticles.slice(0, 5);
          apiHasMore = fallbackArticles.length > 5;
        }

        // Update state
        if (append) {
          setArticles((prev) => [...prev, ...newArticles]);
        } else {
          setArticles(newArticles);
          setPage(pageNum);
        }

        // Update hasMore correctly
        setHasMore(apiHasMore);

        console.log(
          `✅ Loaded ${newArticles.length} articles for tab: ${activeTab}, hasMore: ${apiHasMore}`
        );
      } catch (error) {
        console.error("❌ Error fetching articles:", error);

        // Fallback articles
        const fallbackArticles = [
          {
            id: 999,
            category: "Indonesia - General",
            title: "Discover Indonesia: Popular Destinations",
            description: "Explore trending destinations across the archipelago",
            days: 1,
            likes: 95,
            comments: 8,
            image: "/images/gambar.png",
          },
        ];

        if (append) {
          setArticles((prev) => [...prev, ...fallbackArticles]);
        } else {
          setArticles(fallbackArticles);
        }

        setHasMore(false); // No more articles on error
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [] // ✅ No dependencies needed since we use top-level functions
  );

  // ✅ SIMPLIFIED: loadMore with cleaner dependencies
  const loadMore = useCallback(
    (activeTab, location = null) => {
      if (!hasMore || loading) {
        console.log(
          "⏹️ Load more skipped - hasMore:",
          hasMore,
          "loading:",
          loading
        );
        return;
      }

      const nextPage = page + 1;
      console.log(`📄 Loading more - page ${nextPage}`);
      setPage(nextPage);
      fetchArticles(activeTab, location, nextPage, true);
    },
    [page, hasMore, loading, fetchArticles]
  );

  // ✅ SIMPLIFIED: resetArticles with no dependencies
  const resetArticles = useCallback(() => {
    console.log("🔄 Resetting articles");
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
    loadingRef.current = false;
  }, []); // ✅ No dependencies needed

  return {
    articles,
    loading,
    hasMore,
    fetchArticles,
    loadMore,
    resetArticles,
  };
};
