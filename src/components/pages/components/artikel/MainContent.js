import React from "react";
import Navbar from "../layout/Navbar";
import LocationStatus from "./LocationStatus";
import ArticlesList from "./ArticlesList";

const MainContent = ({
  categories,
  activeTab,
  setActiveTab,
  // Location props
  userLocation,
  locationLoading,
  locationError,
  isWatchingLocation,
  onRetryLocation,
  onRefreshArticles,
  // Articles props
  articles,
  articlesLoading,
  hasMore,
  onLoadMore,
}) => {
  return (
    <div className="w-full md:w-3/4 pr-0 md:pr-8">
      <Navbar
        categories={categories}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Real-time Location Display */}
      {activeTab === "Regional Exploration" && (
        <div className="mt-4 mb-4">
          <LocationStatus
            loading={locationLoading}
            locationError={locationError}
            userLocation={userLocation}
            isWatchingLocation={isWatchingLocation}
            onRetry={onRetryLocation}
            onRefreshArticles={onRefreshArticles}
          />
        </div>
      )}

      {/* Articles List */}
      <div className="mt-4">
        <ArticlesList
          articles={articles}
          loading={articlesLoading}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          activeTab={activeTab}
          onRetryLocation={onRetryLocation}
        />
      </div>
    </div>
  );
};

export default MainContent;
