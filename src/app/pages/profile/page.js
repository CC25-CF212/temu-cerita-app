// "use client";
// import Head from "next/head";
// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import { useEffect } from "react";
// import { AuthCheck } from "@/hooks/auth-check";
// import Header from "@/components/pages/components/layout/Header";
// import Footer from "@/components/pages/components/layout/Footer";

// // Profile Sidebar Component
// const ProfileSidebar = ({ dataUser }) => {
//   return (
//     <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
//       <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
//         <img
//           src={dataUser?.user?.image}
//           alt="Profile"
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <h2 className="mt-4 text-lg font-medium">{dataUser?.user?.name}</h2>
//       <button className="mt-2 px-4 py-1 text-green-600 text-sm border border-green-600 rounded-full hover:bg-green-50 transition-colors">
//         Edit Profile
//       </button>
//     </div>
//   );
// };

// // Navigation Tabs Component
// const NavigationTabs = ({ activeTab, setActiveTab }) => {
//   return (
//     <div className="flex border-b border-gray-200 mt-4">
//       <button
//         onClick={() => setActiveTab("home")}
//         className={`px-8 py-2 ${
//           activeTab === "home"
//             ? "border-b-2 border-blue-500 text-blue-500 font-medium"
//             : ""
//         }`}
//       >
//         Saved
//       </button>
//       <button
//         onClick={() => setActiveTab("like")}
//         className={`px-8 py-2 ${
//           activeTab === "like"
//             ? "border-b-2 border-blue-500 text-blue-500 font-medium"
//             : ""
//         }`}
//       >
//         Like
//       </button>
//     </div>
//   );
// };

// // Article Card Component
// const ArticleCard = ({ title, description, years, likes, comments }) => {
//   return (
//     <div className="border-b border-gray-200 py-6">
//       <h3 className="text-xl font-bold">{title}</h3>
//       <p className="text-gray-600 mt-1">{description}</p>
//       <div className="flex items-center mt-2 text-sm text-gray-500">
//         <span>{years} years</span>
//         <div className="flex items-center ml-4">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4 mr-1"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
//             />
//           </svg>
//           {likes}
//         </div>
//         <div className="flex items-center ml-4">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4 mr-1"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
//             />
//           </svg>
//           {comments}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Home Content Component
// const HomeContent = () => {
//   // Sample article data
//   const articles = [
//     {
//       id: 1,
//       title: "When did your data REALLY arrive in BigQuery?",
//       description: "A short guide on capturing data ingestion time in BigQuery",
//       years: 3,
//       likes: 45,
//       comments: 5,
//     },
//     {
//       id: 2,
//       title: "When did your data REALLY arrive in BigQuery?",
//       description: "A short guide on capturing data ingestion time in BigQuery",
//       years: 3,
//       likes: 45,
//       comments: 5,
//     },
//     {
//       id: 3,
//       title: "When did your data REALLY arrive in BigQuery?",
//       description: "A short guide on capturing data ingestion time in BigQuery",
//       years: 3,
//       likes: 45,
//       comments: 5,
//     },
//     {
//       id: 4,
//       title: "When did your data REALLY arrive in BigQuery?",
//       description: "A short guide on capturing data ingestion time in BigQuery",
//       years: 3,
//       likes: 45,
//       comments: 5,
//     },
//   ];

//   return (
//     <div className="mt-2">
//       {articles.map((article) => (
//         <ArticleCard
//           key={article.id}
//           title={article.title}
//           description={article.description}
//           years={article.years}
//           likes={article.likes}
//           comments={article.comments}
//         />
//       ))}
//     </div>
//   );
// };

// // Like Content Component
// const LikeContent = () => {
//   // Sample liked articles data
//   const likedArticles = [
//     {
//       id: 1,
//       title: "The Future of Data Engineering in 2025",
//       description: "Exploring trends and technologies shaping the field",
//       years: 1,
//       likes: 87,
//       comments: 12,
//     },
//     {
//       id: 2,
//       title: "Advanced BigQuery Optimization Techniques",
//       description: "Strategies to improve query performance and reduce costs",
//       years: 2,
//       likes: 62,
//       comments: 8,
//     },
//   ];

//   return (
//     <div className="mt-2">
//       {likedArticles.length > 0 ? (
//         likedArticles.map((article) => (
//           <ArticleCard
//             key={article.id}
//             title={article.title}
//             description={article.description}
//             years={article.years}
//             likes={article.likes}
//             comments={article.comments}
//           />
//         ))
//       ) : (
//         <div className="py-8 text-center text-gray-500">
//           You haven't liked any articles yet.
//         </div>
//       )}
//     </div>
//   );
// };

// // Main Content Component
// const MainContent = ({ activeTab }) => {
//   return <div>{activeTab === "home" ? <HomeContent /> : <LikeContent />}</div>;
// };

// // Main App Component
// const Profile = () => {
//   const [activeTab, setActiveTab] = useState("home");
//   const { data: session, status } = useSession();
//   // Handle klik di luar area notifikasi untuk menutup panel
//   useEffect(() => {
//     if (status === "authenticated") {
//       console.log("User session loaded:", session);
//       console.log("Name:", session?.user?.name);
//       console.log("Email:", session?.user?.email);
//       console.log("Image URL:", session?.user?.image);
//     }
//   }, [session, status]);
//   return (
//     <AuthCheck>
//       <div className="min-h-screen bg-gray-50">
//         <Head>
//           <title>TemuCerita - Profile</title>
//           <meta
//             name="description"
//             content="Discover stories and articles on TemuCerita"
//           />
//           <link rel="icon" href="/favicon.ico" />
//         </Head>

//         <Header />

//         <main className="max-w-screen-xl mx-auto px-4 py-8">
//           <div className="flex flex-col md:flex-row gap-8">
//             {/* Left Column - Profile */}
//             <div className="w-full md:w-1/4 sticky top-24 self-start">
//               <ProfileSidebar dataUser={session} />
//             </div>

//             {/* Right Column - Articles */}
//             <div className="w-full md:w-3/4 bg-white rounded-lg shadow-sm p-6">
//               <NavigationTabs
//                 activeTab={activeTab}
//                 setActiveTab={setActiveTab}
//               />
//               <MainContent activeTab={activeTab} />
//             </div>
//           </div>
//         </main>

//         <Footer />
//       </div>
//     </AuthCheck>
//   );
// };

// export default Profile;
"use client";
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthCheck } from "@/hooks/auth-check";
import Header from "@/components/pages/components/layout/Header";
import Footer from "@/components/pages/components/layout/Footer";

// Loading Skeleton Component
const ArticleCardSkeleton = () => {
  return (
    <div className="border-b border-gray-200 py-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="flex items-center space-x-4">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-gray-600">Loading more articles...</span>
    </div>
  );
};

// Profile Sidebar Component
const ProfileSidebar = ({ dataUser }) => {
  const handleEditToggle = () => {
    // Logic to toggle edit mode
    window.location.href = "/pages/profile/update";
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
        <img
          src={dataUser?.user?.image}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="mt-4 text-lg font-medium">{dataUser?.user?.name}</h2>
      <button
        onClick={handleEditToggle}
        className="mt-2 px-4 py-1 text-green-600 text-sm border border-green-600 rounded-full hover:bg-green-50 transition-colors"
      >
        Edit Profile
      </button>
    </div>
  );
};

// Navigation Tabs Component
const NavigationTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200 mt-4">
      <button
        onClick={() => setActiveTab("saved")}
        className={`px-8 py-2 ${
          activeTab === "saved"
            ? "border-b-2 border-blue-500 text-blue-500 font-medium"
            : ""
        }`}
      >
        Saved
      </button>
      <button
        onClick={() => setActiveTab("likes")}
        className={`px-8 py-2 ${
          activeTab === "likes"
            ? "border-b-2 border-blue-500 text-blue-500 font-medium"
            : ""
        }`}
      >
        Liked
      </button>
    </div>
  );
};

// Article Card Component
const ArticleCard = ({ article }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
  };
  const handleRedirect = () => {
    window.location.href = `/pages/article/detail/${article.id}`;
  };
  return (
    <div
      className="border-b border-gray-200 py-6 hover:bg-gray-50 transition-colors"
      onClick={handleRedirect}
    >
      <div className="flex gap-4">
        {article.thumbnail_url && (
          <div className="w-20 h-20 flex-shrink-0">
            <img
              src={article.thumbnail_url}
              alt={article.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold hover:text-blue-600 cursor-pointer">
            {article.title}
          </h3>
          <div
            className="text-gray-600 mt-1 line-clamp-2"
            dangerouslySetInnerHTML={{
              __html:
                article.content_html
                  ?.replace(/<[^>]*>/g, "")
                  .substring(0, 150) + "...",
            }}
          />
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2">
              {article.city}, {article.province}
            </span>
            <span>{formatDate(article.created_at)}</span>
            <div className="flex items-center ml-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {article.like_count}
            </div>
            <div className="flex items-center ml-4">
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
              {article.comment_count}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Content Component with API Integration
const MainContent = ({ activeTab, userId }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const fetchArticles = useCallback(
    async (pageNum = 1, reset = false) => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        const endpoint =
          activeTab === "saved"
            ? `/api/articles/saved/${userId}?page=${pageNum}&limit=10`
            : `/api/articles/likes/${userId}?page=${pageNum}&limit=10`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        // Extract articles based on response structure
        let newArticles = [];
        if (activeTab === "saved") {
          newArticles = data.saved_articles || [];
        } else {
          newArticles = data.liked_articles || [];
        }

        if (reset) {
          setArticles(newArticles);
        } else {
          setArticles((prev) => [...prev, ...newArticles]);
        }

        // Check if there are more articles
        setHasMore(newArticles.length === 10);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [userId, activeTab]
  );

  // Reset and fetch when tab changes
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    fetchArticles(1, true);
  }, [activeTab, fetchArticles]);

  // Load more articles for infinite scroll
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage, false);
  };

  if (loading && articles.length === 0) {
    return (
      <div className="mt-2">
        {[...Array(3)].map((_, index) => (
          <ArticleCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-2 py-8 text-center">
        <div className="text-red-600 mb-2">Error loading articles</div>
        <div className="text-sm text-gray-500 mb-4">{error}</div>
        <button
          onClick={() => fetchArticles(1, true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (articles.length === 0 && !loading) {
    return (
      <div className="mt-2 py-8 text-center text-gray-500">
        {activeTab === "saved"
          ? "You haven't saved any articles yet."
          : "You haven't liked any articles yet."}
      </div>
    );
  }

  return (
    <div className="mt-2">
      <InfiniteScroll
        dataLength={articles.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
        endMessage={
          <div className="py-8 text-center text-gray-500">
            <p>You've reached the end of the list!</p>
          </div>
        }
      >
        {articles.map((article, index) => (
          <ArticleCard key={`${article.id}-${index}`} article={article} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

// Main App Component
const Profile = () => {
  const [activeTab, setActiveTab] = useState("saved");
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      console.log("User session loaded:", session);
      console.log("Name:", session?.user?.name);
      console.log("Email:", session?.user?.email);
      console.log("Image URL:", session?.user?.image);
      console.log("User ID:", session?.user?.id);
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>TemuCerita - Profile</title>
          <meta
            name="description"
            content="Discover stories and articles on TemuCerita"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <main className="max-w-screen-xl mx-auto px-4 py-8 min-h-screen">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Profile */}
            <div className="w-full md:w-1/4 sticky top-24 self-start">
              <ProfileSidebar dataUser={session} />
            </div>

            {/* Right Column - Articles */}
            <div className="w-full md:w-3/4 bg-white rounded-lg shadow-sm p-6">
              <NavigationTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <MainContent activeTab={activeTab} userId={session?.user?.id} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AuthCheck>
  );
};

export default Profile;
