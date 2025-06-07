"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";
import { AuthCheck } from "@/hooks/auth-check";
import Header from "@/components/pages/components/layout/Header";
import Footer from "@/components/pages/components/layout/Footer";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useArticles } from "@/hooks/useArticles";
import MainContent from "@/components/pages/components/artikel/MainContent";
import FixedSidePanel from "@/components/pages/components/FixedSidePanel";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const [activeTab, setActiveTab] = useState("For You");

  // ✅ FIXED: Add ref to track previous values and prevent unnecessary re-fetches
  const previousTab = useRef(activeTab);
  const previousLocationKey = useRef("");

  // Location tracking hook
  const {
    userLocation,
    loading: locationLoading,
    locationError,
    isWatchingLocation,
    startLocationTracking,
  } = useLocationTracking();

  // Articles hook with stable functions
  const {
    articles,
    loading: articlesLoading,
    hasMore,
    fetchArticles,
    loadMore,
    resetArticles,
  } = useArticles();
  const {
    setArtikel,
    recommendations,
    isLoadingRecommendations,
    getRecommendations,
  } = useAuthStore();
  const categories = ["For You", "All Article", "Regional Exploration"];

  // ✅ FIXED: Create stable location key to prevent unnecessary updates
  const locationKey = userLocation
    ? `${userLocation.city}-${userLocation.district}-${Math.floor(
        userLocation.timestamp / 60000
      )}` // Update every minute max
    : "";

  // ✅ FIXED: Enhanced useEffect with location loading guard
  useEffect(() => {
    const tabChanged = previousTab.current !== activeTab;
    const locationChanged = previousLocationKey.current !== locationKey;

    // ✅ GUARD: Don't proceed if location is still loading for Regional tab
    if (activeTab === "Regional Exploration" && locationLoading) {
      console.log("⏳ Location still loading for Regional tab, waiting...");
      return;
    }

    // Only proceed if there's an actual change
    if (!tabChanged && !locationChanged) {
      console.log("⏸️ No significant changes, skipping fetch");
      return;
    }

    // Update refs
    previousTab.current = activeTab;
    previousLocationKey.current = locationKey;

    // Reset articles for any tab change
    if (tabChanged) {
      resetArticles();
    }

    // Fetch logic
    if (activeTab === "Regional Exploration") {
      if (userLocation && locationKey && !locationLoading) {
        console.log("🌍 Fetching Regional articles with location");
        fetchArticles(activeTab, userLocation);
      } else if (!locationLoading && !userLocation) {
        console.log("❌ No location available for Regional tab");
        // Could show error state or fallback
      } else {
        console.log("📍 Waiting for location for Regional tab");
        // Don't fetch, just show loading/waiting state
      }
    } else {
      console.log(`📰 Fetching ${activeTab} articles`);
      fetchArticles(activeTab,null,recommendations);
    }
  }, [
    activeTab,
    locationKey,
    userLocation,
    locationLoading,
    fetchArticles,
    resetArticles,
  ]);

  // ✅ FIXED: Simplified handleTabChange
  const handleTabChange = useCallback(
    (newTab) => {
      console.log(`🔄 Tab change: ${activeTab} → ${newTab}`);
      setActiveTab(newTab);
    },
    [activeTab]
  );

  // ✅ FIXED: Stable handleRefreshArticles with proper dependency
  const handleRefreshArticles = useCallback(
    (location) => {
      console.log("🔄 Manual refresh articles with location:", location?.city);
      if (activeTab === "Regional Exploration" && location) {
        resetArticles();
        fetchArticles(activeTab, location);
      }
    },
    [activeTab, fetchArticles, resetArticles]
  );

  // ✅ FIXED: Stable handleLoadMore
  const handleLoadMore = useCallback(() => {
    console.log(`📄 Loading more articles for ${activeTab}`);
    if (activeTab === "Regional Exploration") {
      loadMore(activeTab, userLocation);
    } else {
      loadMore(activeTab);
    }
  }, [activeTab, userLocation, loadMore]);

  // Start location tracking on mount (unchanged)
  useEffect(() => {
    console.log("🚀 Starting location tracking...");
    const cleanup = startLocationTracking();
    return cleanup;
  }, [startLocationTracking]);

  return (
    <>
      <AuthCheck>
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
      </AuthCheck>
    </>
  );
}
