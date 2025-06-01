import { useState, useCallback, useRef } from "react";

// Updated API function with pagination support
export async function staticArticlesByCategory(category, options = {}) {
  const { page = 1, limit = 5 } = options;
  try {
    console.log("Calling API with category:", category, "page:", page);

    const url = new URL("/api/article", window.location.origin);
    if (category) url.searchParams.set("category", category);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("limit", limit.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched articles:", data);

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

  // Generate location-based articles
  const generateLocationArticles = (locationData, startId = Date.now()) => {
    const cityName = locationData?.city || "Unknown";
    const district = locationData?.district || "";

    const baseArticles = [
      {
        id: startId + 1,
        category: `${cityName} - Local Guide`,
        title: `Hidden Gems dan Local Favorites di ${cityName}`,
        description: `Tempat-tempat menarik yang hanya diketahui local residents di ${cityName}${
          district ? ` area ${district}` : ""
        }`,
        days: Math.floor(Math.random() * 7) + 1,
        likes: Math.floor(Math.random() * 200) + 50,
        comments: Math.floor(Math.random() * 30) + 5,
        image: "/images/gambar.png",
      },
      {
        id: startId + 2,
        category: `${cityName} - Kuliner`,
        title: `Best Food Spots in ${cityName} - Local Recommendations`,
        description: `Kuliner autentik dan tempat makan favorit warga lokal ${cityName}`,
        days: Math.floor(Math.random() * 5) + 1,
        likes: Math.floor(Math.random() * 150) + 30,
        comments: Math.floor(Math.random() * 25) + 3,
        image: "/images/gambar.png",
      },
      {
        id: startId + 3,
        category: `${cityName} - Lifestyle`,
        title: `Living in ${cityName}: A Local's Perspective`,
        description: `Tips dan insight tentang kehidupan sehari-hari di ${cityName}${
          district ? ` khususnya area ${district}` : ""
        }`,
        days: Math.floor(Math.random() * 10) + 1,
        likes: Math.floor(Math.random() * 100) + 20,
        comments: Math.floor(Math.random() * 20) + 2,
        image: "/images/gambar.png",
      },
    ];

    // City-specific articles
    if (cityName.toLowerCase().includes("jakarta")) {
      baseArticles.push({
        id: startId + 4,
        category: "Jakarta - Transport",
        title: "Navigating Jakarta: TransJakarta dan MRT Guide",
        description:
          "Panduan lengkap transportasi umum di Jakarta untuk daily commute",
        days: 1,
        likes: 245,
        comments: 18,
        image: "/images/gambar.png",
      });
    }

    if (cityName.toLowerCase().includes("tangerang")) {
      baseArticles.push({
        id: startId + 5,
        category: "Tangerang - Modern Living",
        title: "Tangerang's Growing Hub: BSD dan Gading Serpong",
        description:
          "Eksplorasi area modern dan lifestyle di satellite city Jakarta",
        days: 2,
        likes: 167,
        comments: 22,
        image: "/images/gambar.png",
      });
    }

    if (cityName.toLowerCase().includes("bandung")) {
      baseArticles.push({
        id: startId + 6,
        category: "Bandung - Creative Scene",
        title: "Bandung's Creative Hub: From Fashion to Art",
        description:
          "Menjelajahi scene kreatif dan komunitas seni di Kota Kembang",
        days: 3,
        likes: 189,
        comments: 15,
        image: "/images/gambar.png",
      });
    }

    return baseArticles;
  };

  // Main fetch function with proper pagination
  const fetchArticles = useCallback(
    async (activeTab, location = null, pageNum = 1, append = false) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        let newArticles = [];
        let apiHasMore = true;

        if (activeTab === "Regional Exploration" && location) {
          // Generate location-based articles
          newArticles = generateLocationArticles(
            location,
            Date.now() + pageNum * 1000
          );
          // For location articles, simulate pagination
          apiHasMore = pageNum < 3; // Limit to 3 pages for location
        } else {
          // API CALLS WITH PROPER PAGINATION
          let apiResponse;

          if (activeTab === "For You") {
            console.log("Fetching For You articles from API...");
            apiResponse = await staticArticlesByCategory("Google Cloud", {
              page: pageNum,
              limit: 5,
            });
          } else if (activeTab === "All Article") {
            console.log("Fetching All Articles from API...");
            apiResponse = await staticArticlesByCategory("", {
              page: pageNum,
              limit: 5,
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

            newArticles = allArticles.slice(
              startIndex,
              startIndex + articlesPerPage
            );
            apiHasMore = startIndex + articlesPerPage < allArticles.length;
          }

          // Handle API response
          if (apiResponse) {
            newArticles = apiResponse.articles;
            apiHasMore = apiResponse.hasMore;

            // Fallback to static if API returns empty
            if (newArticles.length === 0 && pageNum === 1) {
              console.log("API returned empty, using fallback data");
              const fallbackArticles =
                staticArticlesByCategoryOld[activeTab] || [];
              newArticles = fallbackArticles.slice(0, 5);
              apiHasMore = fallbackArticles.length > 5;
            }
          }
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
          `Loaded ${newArticles.length} articles for tab: ${activeTab}, hasMore: ${apiHasMore}`
        );
      } catch (error) {
        console.error("Error fetching articles:", error);

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
    []
  );

  // Load more with proper page increment
  const loadMore = useCallback(
    (activeTab, location = null) => {
      if (!hasMore || loading) return;

      const nextPage = page + 1;
      setPage(nextPage);
      fetchArticles(activeTab, location, nextPage, true);
    },
    [page, hasMore, loading, fetchArticles]
  );

  // Reset articles
  const resetArticles = useCallback(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
    loadingRef.current = false;
  }, []);

  return {
    articles,
    loading,
    hasMore,
    fetchArticles,
    loadMore,
    resetArticles,
  };
};
