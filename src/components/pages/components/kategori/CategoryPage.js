"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { useAuth } from "../../../../context/AuthContext";
import { fetchArticles, fetchCategories } from "../../../../utils/articles";
import ImageGallery from "@/components/images/ImageGallery";

// Category Tag Component
const CategoryTag = ({ text, active, onClick }) => {
  return (
    <button
      className={`px-4 py-1 text-sm rounded-full mr-2 transition-colors ${
        active
          ? "bg-indigo-600 text-white hover:bg-indigo-700"
          : "bg-white shadow-sm hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
// Nature images
const natureImages = [
  {
    src: "/images/gambar.png",
    alt: "Mountain landscape",
    caption: "Mountain range at sunset",
  },
  {
    src: "/images/gambar.png",
    alt: "Ocean beach",
    caption: "Sandy beach with waves",
  },
  {
    src: "/images/gambar.png",
    alt: "Dense forest",
    caption: "Ancient forest with tall trees",
  },
  {
    src: "/images/gambar.png",
    alt: "Desert landscape",
    caption: "Sand dunes at dawn",
  },
];
// Featured Article Component
const FeaturedArticle = ({ article }) => {
  // Nature images
  const natureImages = [
    {
      src: "/images/gambar.png",
      alt: "Mountain landscape",
      caption: "Mountain range at sunset",
    },
    {
      src: "/images/robil.jpeg",
      alt: "Ocean beach",
      caption: "Sandy beach with waves",
    },
    {
      src: "/images/teo.jpg",
      alt: "Dense forest",
      caption: "Ancient forest with tall trees",
    },
    {
      src: "/images/Apipah.jpg",
      alt: "Desert landscape",
      caption: "Sand dunes at dawn",
    },
  ];
  if (!article) return null;

  return (
    <div className="mb-12">
      <div className="w-full h-120 rounded-lg bg-gray-200 mb-6">
        {/* Placeholder for article image */}
        <ImageGallery images={natureImages.slice(0, 3)} />
      </div>
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white mr-2">
          {article.authorInitial}
        </div>
        <span className="font-medium">{article.author}</span>
      </div>
      <h2 className="text-3xl font-bold mb-2 text-center">{article.title}</h2>
      <p className="text-gray-600 text-center mb-4">{article.description}</p>
      <div className="flex items-center justify-center space-x-4 text-gray-600">
        <span>{article.years} years</span>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          <span>{article.likes}</span>
        </div>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span>{article.comments}</span>
        </div>
      </div>
    </div>
  );
};

// Article Card Component
const ArticleCard = ({
  category,
  title,
  description,
  years,
  likes,
  comments,
}) => {
  return (
    <div className="mb-8 cursor-pointer hover:opacity-90 transition-opacity">
      <div className="w-full h-56 bg-gray-200 rounded-lg mb-3"></div>
      <div className="mb-1">
        <span className="text-sm text-gray-700">{category}</span>
      </div>
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-gray-600 text-sm mb-2">{description}</p>
      <div className="flex items-center space-x-3 text-sm text-gray-500">
        <span>{years} years</span>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          <span>{likes}</span>
        </div>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span>{comments}</span>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      <p className="mt-4 text-gray-600">Loading articles...</p>
    </div>
  );
};

// Main Category Page Component
const CategoryPage = () => {
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  //   const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load categories and set the active category from URL parameters
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(["All", ...categoriesData]);

        // Check for category in URL
        const categoryParam = searchParams.get("category");
        if (categoryParam && categoriesData.includes(categoryParam)) {
          setSelectedCategory(categoryParam);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, [searchParams]);

  // Load articles based on selected category
  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const data = await fetchArticles(
          selectedCategory === "All" ? null : selectedCategory
        );
        setArticles(data.articles);
        // setFeaturedArticle(data.featured);
        setFeaturedArticle(data.articles[0]);
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [selectedCategory]);

  //   // Check if user is authenticated
  //   useEffect(() => {
  //     if (!authLoading && !user) {
  //       router.push("/login");
  //     }
  //   }, [user, authLoading, router]);

  // Handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    // Update URL with the selected category
    const params = new URLSearchParams();
    if (category !== "All") {
      params.set("category", category);
    }

    const newUrl =
      window.location.pathname +
      (params.toString() ? `?${params.toString()}` : "");
    router.push(newUrl);
  };

  //   if (authLoading) {
  //     return <LoadingState />;
  //   }

  //   // If not authenticated, the useEffect will redirect
  //   if (!user) {
  //     return null;
  //   }

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Category Tags */}
      <div className="flex flex-wrap mb-6">
        {categories.map((category) => (
          <CategoryTag
            key={category}
            text={category}
            active={selectedCategory === category}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>

      {/* Category Title */}
      <h1 className="text-4xl font-bold text-center mb-10">
        {selectedCategory}
      </h1>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {/* Featured Article */}
          {featuredArticle && <FeaturedArticle article={featuredArticle} />}

          {/* Article Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  category={article.category}
                  title={article.title}
                  description={article.description}
                  years={article.years}
                  likes={article.likes}
                  comments={article.comments}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">
                No articles found for this category.
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default CategoryPage;
