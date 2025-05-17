"use client";
import { useState } from "react";
import Head from "next/head";
import Header from "../../components/pages/components/Header";
import Footer from "../../components/pages/components/Footer";
import Navbar from "../../components/pages/components/Navbar";
import ArticleCard from "../../components/pages/components/ArticleCard";
import SidePanel from "../../components/pages/components/SidePanel";
export default function Home() {
  const [activeTab, setActiveTab] = useState("For You");

  // Dummy data for articles
  // Data artikel untuk berbagai kategori
  const articlesByCategory = {
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
        id: 3,
        category: "Google Cloud - Community",
        title: "When did your data REALLY arrive in BigQuery?",
        description:
          "A short guide on capturing data ingestion time in BigQuery",
        days: 2,
        likes: 45,
        comments: 5,
        image: "/images/gambar.png",
      },
    ],
    "All Article": [
      {
        id: 4,
        category: "Web Development",
        title: "Building responsive web applications with Next.js and Tailwind",
        description:
          "A comprehensive guide to modern web development techniques",
        days: 5,
        likes: 87,
        comments: 12,
        image: "/images/gambar.png",
      },
      {
        id: 5,
        category: "Software Architecture",
        title: "Microservices vs Monoliths: Making the right choice",
        description: "Comparing architecture patterns for modern applications",
        days: 7,
        likes: 124,
        comments: 18,
        image: "/images/gambar.png",
      },
      {
        id: 6,
        category: "Data Science",
        title: "Practical Machine Learning with Python",
        description: "Implementation of ML algorithms in real-world scenarios",
        days: 3,
        likes: 73,
        comments: 9,
        image: "/images/gambar.png",
      },
    ],
    "Regional Exploration": [
      {
        id: 7,
        category: "Travel - Indonesia",
        title: "Hidden Gems of Bali Beyond the Tourist Trails",
        description: "Discovering authentic experiences in the island of gods",
        days: 4,
        likes: 156,
        comments: 21,
        image: "/images/gambar.png",
      },
      {
        id: 8,
        category: "Culture - Java",
        title: "The Rich Cultural Heritage of Solo and Yogyakarta",
        description: "Exploring traditional arts, crafts and culinary delights",
        days: 6,
        likes: 93,
        comments: 15,
        image: "/images/gambar.png",
      },
      {
        id: 9,
        category: "Adventure - Sulawesi",
        title: "Trekking the Ancient Villages of Toraja",
        description:
          "A journey through time in the highlands of South Sulawesi",
        days: 5,
        likes: 68,
        comments: 8,
        image: "/images/gambar.png",
      },
    ],
    Categories: [
      {
        id: 10,
        category: "Technology",
        title: "Trending Tech Categories of 2025",
        description: "Browse through the most popular technology topics",
        days: 1,
        likes: 52,
        comments: 7,
        image: "/images/gambar.png",
      },
      {
        id: 11,
        category: "Lifestyle",
        title: "Wellness and Self-Care: Categories for Modern Living",
        description: "Topics focused on health, mindfulness and well-being",
        days: 3,
        likes: 89,
        comments: 11,
        image: "/images/gambar.png",
      },
      {
        id: 12,
        category: "Arts & Literature",
        title: "Exploring Creative Categories",
        description:
          "From poetry to visual arts - find your creative inspiration",
        days: 2,
        likes: 63,
        comments: 6,
        image: "/images/gambar.png",
      },
    ],
  };

  // Categories for the navbar
  const categories = [
    "For You",
    "All Article",
    "Regional Exploration",
    "Categories",
  ];
  // Mendapatkan artikel yang sesuai dengan tab aktif
  const currentArticles = articlesByCategory[activeTab] || [];
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>TemuCerita - {activeTab}</title>
        <meta
          name="description"
          content={`Discover ${activeTab} stories and articles on TemuCerita`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex flex-col md:flex-row max-w-screen-xl mx-auto px-4">
        <div className="w-full md:w-3/4 pr-0 md:pr-8">
          <Navbar
            categories={categories}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="mt-4">
            {currentArticles.length > 0 ? (
              currentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">
                  No articles found for this category.
                </p>
              </div>
            )}
          </div>
        </div>

        <SidePanel activeTab={activeTab} />
      </main>
      <Footer />
    </div>
  );
}
