import Link from "next/link";
import { User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useArticles } from "@/hooks/useArticles";

const SidePanel = ({ activeTab, userLocation }) => {
  const { articles, loading, fetchArticles } = useArticles();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllWriters, setShowAllWriters] = useState(false);

  // Fetch articles saat komponen mount atau activeTab berubah
  useEffect(() => {
    fetchArticles(activeTab, userLocation);
  }, [activeTab, fetchArticles]);

  // Generate cultural highlight dari artikel pertama
  const culturalHighlight = useMemo(() => {
    if (articles.length > 0) {
      const firstArticle = articles[0];
      return {
        id: firstArticle.id,
        title: firstArticle.title,
        author: `by ${firstArticle.author.name.split(" - ")[0]}`,
        description: firstArticle.description,
        date: `${firstArticle.days} ${
          firstArticle.days === 1 ? "day" : "days"
        } ago`,
        location: firstArticle.category.includes(" - ")
          ? firstArticle.category.split(" - ")[0]
          : "Indonesia",
        image: firstArticle.image || "/images/gambar.png",
      };
    }

    // Fallback data
    return {
      title: "Discover Amazing Stories",
      author: "by TemuCerita Community",
      description: "Explore fascinating stories from across Indonesia",
      date: "1 day ago",
      location: "Indonesia",
      image: "/images/gambar.png",
    };
  }, [articles]);

  // Generate categories dari artikel yang ada
  const categories = useMemo(() => {
    const categoryMap = new Map();

    articles.forEach((article) => {
      const category = article.category.split(" - ")[1] || article.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          id: categoryMap.size + 1,
          name: category,
        });
      }
    });

    const dynamicCategories = Array.from(categoryMap.values());

    // Fallback categories jika tidak ada artikel
    if (dynamicCategories.length === 0) {
      const fallbackCategories = {
        "For You": [
          { id: 1, name: "Short Story" },
          { id: 2, name: "Travel" },
          { id: 3, name: "Culture" },
          { id: 4, name: "Technology" },
          { id: 5, name: "Food" },
        ],
        "All Article": [
          { id: 1, name: "Latest" },
          { id: 2, name: "Popular" },
          { id: 3, name: "Editor's Pick" },
          { id: 4, name: "Featured" },
          { id: 5, name: "Trending" },
        ],
        "Regional Exploration": [
          { id: 1, name: "Local Guide" },
          { id: 2, name: "Kuliner" },
          { id: 3, name: "Lifestyle" },
          { id: 4, name: "Transport" },
          { id: 5, name: "Creative Scene" },
        ],
        Categories: [
          { id: 1, name: "Fiction" },
          { id: 2, name: "Non-Fiction" },
          { id: 3, name: "Biography" },
          { id: 4, name: "History" },
          { id: 5, name: "Science" },
        ],
      };
      return fallbackCategories[activeTab] || fallbackCategories["For You"];
    }

    return dynamicCategories;
  }, [articles, activeTab]);

  // Generate writers dari artikel yang ada
  const writers = useMemo(() => {
    const writerMap = new Map();

    articles.forEach((article) => {
      const writerName = article.author?.name.split(" - ")[0] || "Anonymous";
      const email = article.author?.email || "unknown@example.com";
      if (!writerMap.has(writerName)) {
        writerMap.set(writerName, {
          id: writerMap.size + 1,
          name: `${writerName}`,
          email: email,
          /* The `followers` property in the code snippet is generating a random number for the
          followers count of a writer. */
          // followers: `${Math.floor(Math.random() * 3) + 1}.${
          //   Math.floor(Math.random() * 9) + 1
          // }M Followers`,
        });
      }
    });

    const dynamicWriters = Array.from(writerMap.values());

    // Fallback writers jika tidak ada artikel
    if (dynamicWriters.length === 0) {
      return [
        { id: 1, name: "Local Writer", followers: "2.4M Followers" },
        { id: 2, name: "Community Writer", followers: "1.8M Followers" },
        { id: 3, name: "Featured Writer", followers: "1.5M Followers" },
        { id: 4, name: "Regional Writer", followers: "1.2M Followers" },
        { id: 5, name: "Cultural Writer", followers: "800K Followers" },
        { id: 6, name: "Travel Writer", followers: "600K Followers" },
      ];
    }

    return dynamicWriters;
  }, [articles]);

  // Logic untuk menampilkan categories
  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 3);
  const hasMoreCategories = categories.length > 3;
  const remainingCategoriesCount = categories.length - 3;

  // Logic untuk menampilkan writers
  const displayedWriters = showAllWriters ? writers : writers.slice(0, 3);
  const hasMoreWriters = writers.length > 3;
  const remainingWritersCount = writers.length - 3;

  const handleShowMoreCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const handleShowMoreWriters = () => {
    setShowAllWriters(!showAllWriters);
  };
  if (articles.length === 0) {
    return null; // Prevent rendering if no articles and still loading
  }
  return (
    <aside className="w-full md:w-1/4 mt-8 md:mt-0 pl-0 md:pl-4">
      {/* Cultural Highlights */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Cultural Highlights</h3>
        <div className="mb-4">
          <div className="bg-gray-200 h-44 w-full mb-4 rounded relative overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <img
                src={
                  articles.length > 0
                    ? culturalHighlight.image
                    : "/images/gambar.png"
                }
                alt="Cultural Highlights"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ) : (
            <>
              <h4 className="font-bold">{culturalHighlight.title}</h4>
              <p className="text-sm text-gray-600 flex items-center">
                <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                  <User size={14} />
                </span>
                {culturalHighlight.author}
              </p>
              <p className="text-sm text-gray-600">
                {culturalHighlight.description}
              </p>
              <p className="text-sm text-gray-600">
                {culturalHighlight.location} - {culturalHighlight.date}
              </p>
            </>
          )}
        </div>
        <Link
          href={`/pages/article/detail/${culturalHighlight.id}`}
          className="text-sm text-gray-600 hover:underline"
        >
          See More
        </Link>
      </div>

      {/* Separator */}
      <div className="border-b border-gray-200 mb-8"></div>

      {/* You may also like */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">You may also like</h3>
        {loading ? (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="py-2 px-4 bg-gray-100 rounded-lg animate-pulse"
              >
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {displayedCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/pages/kategori?category=${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="py-2 px-4 bg-gray-50 rounded-lg text-center text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            {hasMoreCategories && (
              <button
                onClick={handleShowMoreCategories}
                className="text-sm text-gray-600 hover:underline transition-colors"
              >
                {showAllCategories
                  ? "Show less"
                  : `Show ${remainingCategoriesCount} more`}
              </button>
            )}
          </>
        )}
      </div>

      {/* Separator */}
      <div className="border-b border-gray-200 mb-8"></div>

      {/* Local Writers */}
      <div>
        <h3 className="text-xl font-bold mb-4">Local Writers</h3>
        {loading ? (
          <div className="space-y-4 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center animate-pulse">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              {displayedWriters.map((writer) => (
                <div key={writer.id} className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {writer.name.length > 10
                        ? writer.name.slice(0, 10) + "..."
                        : writer.name}
                    </p>
                    {/* <p className="text-sm text-gray-600">{writer.followers}</p> */}
                    <p className="text-sm text-gray-600">
                      {writer.email.length > 20
                        ? writer.email.slice(0, 20) + "..."
                        : writer.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {hasMoreWriters && (
              <button
                onClick={handleShowMoreWriters}
                className="text-sm text-gray-600 hover:underline transition-colors"
              >
                {showAllWriters
                  ? "Show less"
                  : `Show ${remainingWritersCount} more`}
              </button>
            )}
          </>
        )}
      </div>
      <div className="border-b border-gray-200 mb-8"></div>
    </aside>
  );
};

export default SidePanel;
