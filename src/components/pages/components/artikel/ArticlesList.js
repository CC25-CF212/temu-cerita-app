import React, { useEffect, useRef, useCallback } from "react";
import ArticleCard from "../ArticleCard";

const ArticlesList = ({
  articles,
  loading,
  hasMore,
  onLoadMore,
  activeTab,
  onRetryLocation,
}) => {
  const observer = useRef();
  const lastArticleElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, onLoadMore]
  );

  if (loading && articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 mt-2">
          {activeTab === "Regional Exploration"
            ? "Loading location-based articles..."
            : "Loading articles..."}
        </p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">No articles found for this category.</p>
        {activeTab === "Regional Exploration" && (
          <button
            onClick={onRetryLocation}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enable Location & Refresh
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article, index) => {
        if (articles.length === index + 1) {
          return (
            <div ref={lastArticleElementRef} key={article.id}>
              <ArticleCard article={article} />
            </div>
          );
        } else {
          return <ArticleCard key={article.id} article={article} />;
        }
      })}

      {/* Loading indicator untuk infinite scroll */}
      {loading && articles.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-2 text-sm">Loading more articles...</p>
        </div>
      )}

      {/* End of articles indicator */}
      {!hasMore && articles.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            🎉 You've reached the end! No more articles to load.
          </p>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;
