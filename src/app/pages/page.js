"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { AuthCheck } from "@/hooks/auth-check";
import Header from "@/components/pages/components/layout/Header";
import Footer from "@/components/pages/components/layout/Footer";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useArticles } from "@/hooks/useArticles";
import MainContent from "@/components/pages/components/artikel/MainContent";
import FixedSidePanel from "@/components/pages/components/FixedSidePanel";

export default function Home() {
  const [activeTab, setActiveTab] = useState("For You");

  // Location tracking hook
  const {
    userLocation,
    loading: locationLoading,
    locationError,
    isWatchingLocation,
    startLocationTracking,
  } = useLocationTracking();

  // Articles hook
  const {
    articles,
    loading: articlesLoading,
    hasMore,
    fetchArticles,
    loadMore,
    resetArticles,
  } = useArticles();

  const categories = ["For You", "All Article", "Regional Exploration"];

  // Handle tab change
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    resetArticles();

    // Fetch articles for new tab
    if (newTab === "Regional Exploration" && userLocation) {
      fetchArticles(newTab, userLocation);
    } else if (newTab !== "Regional Exploration") {
      fetchArticles(newTab);
    }
  };

  // Handle location refresh
  const handleRefreshArticles = (location) => {
    if (activeTab === "Regional Exploration") {
      resetArticles();
      fetchArticles(activeTab, location);
    }
  };

  // Handle load more for infinite scroll
  const handleLoadMore = () => {
    if (activeTab === "Regional Exploration") {
      loadMore(activeTab, userLocation);
    } else {
      loadMore(activeTab);
    }
  };

  // Start location tracking on mount
  useEffect(() => {
    const cleanup = startLocationTracking();
    return cleanup;
  }, [startLocationTracking]);

  // Fetch articles when location is detected for Regional Exploration
  useEffect(() => {
    if (userLocation && activeTab === "Regional Exploration") {
      resetArticles();
      fetchArticles(activeTab, userLocation);
    }
  }, [userLocation, activeTab, fetchArticles, resetArticles]);

  // Fetch articles when changing to non-location tabs
  useEffect(() => {
    if (activeTab !== "Regional Exploration") {
      resetArticles();
      fetchArticles(activeTab);
    }
  }, [activeTab, fetchArticles, resetArticles]);

  return (
    <>
      {/* <AuthCheck> */}
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
          <MainContent
            categories={categories}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            // Location props
            userLocation={userLocation}
            locationLoading={locationLoading}
            locationError={locationError}
            isWatchingLocation={isWatchingLocation}
            onRetryLocation={startLocationTracking}
            onRefreshArticles={handleRefreshArticles}
            // Articles props
            articles={articles}
            articlesLoading={articlesLoading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />

          <FixedSidePanel activeTab={activeTab} userLocation={userLocation} />
        </main>

        <Footer />
      </div>
      {/* </AuthCheck> */}
    </>
  );
}
