import React, { useCallback, useMemo } from "react";

const LocationStatus = ({
  loading,
  locationError,
  userLocation,
  isWatchingLocation,
  onRetry,
  onRefreshArticles,
}) => {
  // ✅ FIXED: Memoize location key to prevent unnecessary re-renders
  const locationKey = useMemo(() => {
    if (!userLocation) return null;
    return `${userLocation.city}-${userLocation.district}-${Math.floor(
      userLocation.timestamp / 60000
    )}`;
  }, [userLocation]);

  // ✅ FIXED: Stable callback dengan dependency yang benar
  const handleRefreshClick = useCallback(() => {
    console.log("🔄 Location Status: Refresh button clicked");
    if (userLocation && onRefreshArticles) {
      onRefreshArticles(userLocation);
    }
  }, [userLocation, onRefreshArticles]); // ✅ Depend on actual values, not derived key

  // ✅ FIXED: Stable retry callback
  const handleRetryClick = useCallback(() => {
    console.log("🔄 Location Status: Retry button clicked");
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
        <p className="text-sm text-blue-700">
          🔍 Detecting your real-time location...
        </p>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-sm text-red-700">⚠️ {locationError}</p>
        <button
          onClick={handleRetryClick}
          className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (userLocation && !loading) {
    return (
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-700">
              📍 <strong>Real-time Location:</strong> {userLocation.city}
              {userLocation.district && `, ${userLocation.district}`}
              {userLocation.state && `, ${userLocation.state}`}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Accuracy: ~{Math.round(userLocation.accuracy)}m | Last updated:{" "}
              {new Date(userLocation.timestamp).toLocaleTimeString("id-ID")}
            </p>
          </div>
          <div className="flex items-center">
            {isWatchingLocation && (
              <div className="flex items-center text-green-600 mr-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                <span className="text-xs">Live</span>
              </div>
            )}
            <button
              onClick={handleRefreshClick}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              Refresh Articles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LocationStatus;
