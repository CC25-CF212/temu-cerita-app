"use client";
import Head from "next/head";
import { useState } from "react";
import Header from "../../../components/pages/components/layout/Header";
import Footer from "../../../components/pages/components/layout/Footer";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

// Profile Sidebar Component
const ProfileSidebar = ({ dataUser }) => {
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
      <button className="mt-2 px-4 py-1 text-green-600 text-sm border border-green-600 rounded-full hover:bg-green-50 transition-colors">
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
        onClick={() => setActiveTab("home")}
        className={`px-8 py-2 ${
          activeTab === "home"
            ? "border-b-2 border-blue-500 text-blue-500 font-medium"
            : ""
        }`}
      >
        Home
      </button>
      <button
        onClick={() => setActiveTab("like")}
        className={`px-8 py-2 ${
          activeTab === "like"
            ? "border-b-2 border-blue-500 text-blue-500 font-medium"
            : ""
        }`}
      >
        Like
      </button>
    </div>
  );
};

// Article Card Component
const ArticleCard = ({ title, description, years, likes, comments }) => {
  return (
    <div className="border-b border-gray-200 py-6">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-600 mt-1">{description}</p>
      <div className="flex items-center mt-2 text-sm text-gray-500">
        <span>{years} years</span>
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
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          {likes}
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
          {comments}
        </div>
      </div>
    </div>
  );
};

// Home Content Component
const HomeContent = () => {
  // Sample article data
  const articles = [
    {
      id: 1,
      title: "When did your data REALLY arrive in BigQuery?",
      description: "A short guide on capturing data ingestion time in BigQuery",
      years: 3,
      likes: 45,
      comments: 5,
    },
    {
      id: 2,
      title: "When did your data REALLY arrive in BigQuery?",
      description: "A short guide on capturing data ingestion time in BigQuery",
      years: 3,
      likes: 45,
      comments: 5,
    },
    {
      id: 3,
      title: "When did your data REALLY arrive in BigQuery?",
      description: "A short guide on capturing data ingestion time in BigQuery",
      years: 3,
      likes: 45,
      comments: 5,
    },
    {
      id: 4,
      title: "When did your data REALLY arrive in BigQuery?",
      description: "A short guide on capturing data ingestion time in BigQuery",
      years: 3,
      likes: 45,
      comments: 5,
    },
  ];

  return (
    <div className="mt-2">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          title={article.title}
          description={article.description}
          years={article.years}
          likes={article.likes}
          comments={article.comments}
        />
      ))}
    </div>
  );
};

// Like Content Component
const LikeContent = () => {
  // Sample liked articles data
  const likedArticles = [
    {
      id: 1,
      title: "The Future of Data Engineering in 2025",
      description: "Exploring trends and technologies shaping the field",
      years: 1,
      likes: 87,
      comments: 12,
    },
    {
      id: 2,
      title: "Advanced BigQuery Optimization Techniques",
      description: "Strategies to improve query performance and reduce costs",
      years: 2,
      likes: 62,
      comments: 8,
    },
  ];

  return (
    <div className="mt-2">
      {likedArticles.length > 0 ? (
        likedArticles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            description={article.description}
            years={article.years}
            likes={article.likes}
            comments={article.comments}
          />
        ))
      ) : (
        <div className="py-8 text-center text-gray-500">
          You haven't liked any articles yet.
        </div>
      )}
    </div>
  );
};

// Main Content Component
const MainContent = ({ activeTab }) => {
  return <div>{activeTab === "home" ? <HomeContent /> : <LikeContent />}</div>;
};

// Main App Component
const Profile = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { data: session, status } = useSession();
  // Handle klik di luar area notifikasi untuk menutup panel
  useEffect(() => {
    if (status === "authenticated") {
      console.log("User session loaded:");
      console.log("Name:", session?.user?.name);
      console.log("Email:", session?.user?.email);
      console.log("Image URL:", session?.user?.image);
    }
  }, [session, status]);
  return (
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

      <main className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Profile */}
          <div className="w-full md:w-1/4 sticky top-24 self-start">
            <ProfileSidebar dataUser={session} />
          </div>

          {/* Right Column - Articles */}
          <div className="w-full md:w-3/4 bg-white rounded-lg shadow-sm p-6">
            <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <MainContent activeTab={activeTab} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
