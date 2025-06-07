"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  BarChart3,
  RefreshCw,
  Server,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Database,
  Search,
  Eye,
  Settings,
  Play,
  Pause,
  LucideIcon,
} from "lucide-react";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import SideMenu from "@/components/SideMenu";

// Types
interface HealthData {
  status: "healthy" | "unhealthy";
  model_loaded: boolean;
  uptime_seconds: number;
  data_freshness: string;
}

interface ModelPerformance {
  avg_similarity: number;
  max_similarity: number;
  matrix_shape: number[];
}

interface ModelStatus {
  total_articles: number;
  last_training: string;
  model_loaded: boolean;
  model_performance: ModelPerformance;
}

interface Metrics {
  data_changes_detected: number;
}

interface RetrainStatus {
  triggered_at: string;
}

interface Recommendation {
  id: string;
  title: string;
  similarity_score: number;
  province?: string;
  city?: string;
}

interface RecommendationsResponse {
  article_id: string;
  total_found: number;
  recommendations: Recommendation[];
}

interface Article {
  id: string;
  title: string;
  province?: string;
  city?: string;
  engagement_score?: number;
}

interface ArticleInfoResponse {
  article: Article;
  retrieved_at: string;
}

interface ApiCallOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Tambahkan interface baru untuk search results
// interface SearchResult {
//   id: string;
//   title: string;
//   province?: string;
//   city?: string;
//   engagement_score?: number;
// }

// interface SearchResponse {
//   articles: SearchResult[];
//   total_found: number;
// }
// Tambahkan interface baru untuk search results sesuai API response
interface SearchResult {
  id: string;
  title: string;
  province?: string;
  city?: string;
  category?: string;
  slug?: string;
  description?: string;
  thumbnail_url?: string;
  likes?: number;
  comments?: number;
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

interface SearchResponse {
  success: boolean;
  data: {
    articles: SearchResult[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_MODEL_BASE_URL;
// Custom Hook for API calls
const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = async <T = any,>(
    endpoint: string,
    options: ApiCallOptions = {}
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });
      console.log("aa", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  return { apiCall, loading, error };
};

// Status Badge Component
interface StatusBadgeProps {
  status: "healthy" | "unhealthy" | "warning" | "info";
  children: React.ReactNode;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  const statusColors = {
    healthy: "bg-green-100 text-green-800 border-green-200",
    unhealthy: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
        statusColors[status] || statusColors.info
      }`}
    >
      {children}
    </span>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: LucideIcon;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  title,
  icon: Icon,
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
  >
    {title && (
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend,
}) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
  </Card>
);

// Main Dashboard Component
const AdminDashboard: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [retrainStatus, setRetrainStatus] = useState<RetrainStatus | null>(
    null
  );
  const [articleId, setArticleId] = useState<string>("");
  const [recommendations, setRecommendations] =
    useState<RecommendationsResponse | null>(null);
  const [articleInfo, setArticleInfo] = useState<ArticleInfoResponse | null>(
    null
  );
  const [sideMenuContainer, setSideMenuContainer] =
    useState<HTMLElement | null>(null);
  const { apiCall, loading, error } = useApi();

  // Tambahkan state baru di dalam komponen AdminDashboard
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<SearchResult | null>(
    null
  );
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  // Fetch dashboard data
  const fetchDashboardData = async (): Promise<void> => {
    try {
      const [health, status, metricsData] = await Promise.all([
        apiCall<HealthData>("/health"),
        apiCall<ModelStatus>("/model/status"),
        apiCall<Metrics>("/metrics"),
      ]);

      setHealthData(health);
      setModelStatus(status);
      setMetrics(metricsData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  // Trigger model retrain
  const handleRetrain = async (force: boolean = false): Promise<void> => {
    try {
      const result = await apiCall<RetrainStatus>("/model/retrain", {
        method: "POST",
        body: JSON.stringify({ force }),
      });
      setRetrainStatus(result);
      setTimeout(fetchDashboardData, 2000); // Refresh data after retrain
    } catch (err) {
      console.error("Failed to trigger retrain:", err);
    }
  };

  // Get recommendations
  const handleGetRecommendations = async (): Promise<void> => {
    if (!articleId.trim()) return;

    try {
      const result = await apiCall<RecommendationsResponse>("/recommend", {
        method: "POST",
        body: JSON.stringify({
          article_id: articleId,
          top_n: 5,
          include_metadata: true,
        }),
      });
      setRecommendations(result);
    } catch (err) {
      console.error("Failed to get recommendations:", err);
    }
  };

  // Get article info
  const handleGetArticleInfo = async (): Promise<void> => {
    if (!articleId.trim()) return;

    try {
      const result = await apiCall<ArticleInfoResponse>(
        `/articles/${articleId}`
      );
      setArticleInfo(result);
    } catch (err) {
      console.error("Failed to get article info:", err);
      setArticleInfo(null);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    const container = document.getElementById("sidemenu-container");
    setSideMenuContainer(container);
  }, []);
  //Call articel id
  // Tambahkan debounce hook
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };
  // Tambahkan fungsi search articles
  const searchArticles = async (query: string): Promise<void> => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setSearchLoading(true);
    try {
      const result = await fetch(
        `/api/articles?city=${encodeURIComponent(query)}&page=1&limit=10`
      );

      const hasil = await result.json();
      setSearchResults(hasil.data.articles || []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Failed to search articles:", err);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle article selection
  const handleArticleSelect = (article: SearchResult): void => {
    setSelectedArticle(article);
    setArticleId(article.id);
    setSearchQuery(article.title);
    setShowDropdown(false);
  };

  // Clear selection
  const handleClearSelection = (): void => {
    setSelectedArticle(null);
    setArticleId("");
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  // Use debounced search
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery && !selectedArticle) {
      searchArticles(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  // Jangan lupa tambahkan event listener untuk menutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".relative")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      {sideMenuContainer && createPortal(<SideMenu />, sideMenuContainer)}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Recommender Admin
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">Error: {error}</p>
            </div>
          )}

          {/* System Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="System Status"
              value={healthData?.status === "healthy" ? "Healthy" : "Unhealthy"}
              subtitle={
                healthData?.model_loaded ? "Model Loaded" : "Model Not Loaded"
              }
              icon={
                healthData?.status === "healthy" ? CheckCircle2 : AlertCircle
              }
              color={healthData?.status === "healthy" ? "green" : "red"}
            />

            <MetricCard
              title="Total Articles"
              value={modelStatus?.total_articles?.toLocaleString() || "0"}
              subtitle="in database"
              icon={Database}
              color="blue"
            />

            <MetricCard
              title="Uptime"
              value={
                healthData ? formatUptime(healthData.uptime_seconds) : "0h 0m"
              }
              subtitle="system running"
              icon={Clock}
              color="purple"
            />

            <MetricCard
              title="Model Performance"
              value={
                modelStatus?.model_performance?.avg_similarity
                  ? (
                      modelStatus.model_performance.avg_similarity * 100
                    ).toFixed(1) + "%"
                  : "N/A"
              }
              subtitle="average similarity"
              icon={TrendingUp}
              color="green"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Model Management */}
            <Card title="Model Management" icon={Settings}>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Training
                    </label>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(modelStatus?.last_training)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model Status
                    </label>
                    <StatusBadge
                      status={
                        modelStatus?.model_loaded ? "healthy" : "unhealthy"
                      }
                    >
                      {modelStatus?.model_loaded ? "Loaded" : "Not Loaded"}
                    </StatusBadge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleRetrain(false)}
                      disabled={loading}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Retrain Model
                    </button>

                    <button
                      onClick={() => handleRetrain(true)}
                      disabled={loading}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Force Retrain
                    </button>
                  </div>
                </div>

                {retrainStatus && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      Retraining triggered at{" "}
                      {formatDateTime(retrainStatus.triggered_at)}
                    </p>
                  </div>
                )}
              </div>
            </Card>
       
            <Card title="Article Testing" icon={Search}>
              <div className="p-6 space-y-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Article 
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (
                          selectedArticle &&
                          e.target.value !== selectedArticle.city
                        ) {
                          setSelectedArticle(null);
                          setArticleId("");
                        }
                      }}
                      onFocus={() => {
                        if (
                          searchResults.length > 0 &&
                          searchQuery.length >= 2
                        ) {
                          setShowDropdown(true);
                        }
                      }}
                      placeholder="Type city name to search articles..."
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {/* Loading spinner */}
                    {searchLoading && (
                      <div className="absolute right-3 top-2.5">
                        <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                      </div>
                    )}

                    {/* Clear button */}
                    {(searchQuery || selectedArticle) && !searchLoading && (
                      <button
                        onClick={handleClearSelection}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}

                    {/* Search dropdown */}
                    {showDropdown && searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {searchResults.map((article) => (
                          <button
                            key={article.id}
                            onClick={() => handleArticleSelect(article)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 line-clamp-2 mb-1">
                                {article.title}
                              </span>
                              {article.description && (
                                <span className="text-xs text-gray-600 line-clamp-2 mb-2">
                                  {article.description}
                                </span>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  ID: {article.id}
                                </span>
                                {article.category && (
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                    {article.category}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                {article.province && (
                                  <span className="text-xs text-gray-500">
                                    {article.city}, {article.province}
                                  </span>
                                )}
                                <div className="flex items-center gap-2">
                                  {article.likes !== undefined && (
                                    <span className="text-xs text-blue-600">
                                      ❤️ {article.likes}
                                    </span>
                                  )}
                                  {article.comments !== undefined && (
                                    <span className="text-xs text-green-600">
                                      💬 {article.comments}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No results message */}
                    {showDropdown &&
                      searchResults.length === 0 &&
                      searchQuery.length >= 2 &&
                      !searchLoading && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                          <p className="text-sm text-gray-500 text-center">
                            No articles found
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {/* Selected article info */}
                {selectedArticle && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900 mb-1">
                          Selected Article
                        </h4>
                        <p className="text-sm text-blue-800 mb-2">
                          {selectedArticle.title}
                        </p>
                        {selectedArticle.description && (
                          <p className="text-xs text-blue-700 mb-2 line-clamp-2">
                            {selectedArticle.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-blue-600 flex-wrap">
                          <span>ID: {selectedArticle.id}</span>
                          {selectedArticle.province && (
                            <span>
                              📍 {selectedArticle.city},{" "}
                              {selectedArticle.province}
                            </span>
                          )}
                          {selectedArticle.category && (
                            <span>🏷️ {selectedArticle.category}</span>
                          )}
                          {selectedArticle.likes !== undefined && (
                            <span>❤️ {selectedArticle.likes}</span>
                          )}
                          {selectedArticle.comments !== undefined && (
                            <span>💬 {selectedArticle.comments}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleClearSelection}
                        className="text-blue-400 hover:text-blue-600 ml-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleGetRecommendations}
                    disabled={loading || !selectedArticle}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Get Recommendations
                  </button>

                  <button
                    onClick={handleGetArticleInfo}
                    disabled={loading || !selectedArticle}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Article
                  </button>
                </div>
              </div>
            </Card>
            {/* Article Testing */}
            {/* <Card title="Article Testing" icon={Search}>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article ID
                  </label>
                  <input
                    type="text"
                    value={articleId}
                    onChange={(e) => setArticleId(e.target.value)}
                    placeholder="Enter article ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleGetRecommendations}
                    disabled={loading || !articleId.trim()}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Get Recommendations
                  </button>

                  <button
                    onClick={handleGetArticleInfo}
                    disabled={loading || !articleId.trim()}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Article
                  </button>
                </div>
              </div>
            </Card> */}
          </div>

          {/* Results Section */}
          {(recommendations || articleInfo) && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recommendations Results */}
              {recommendations && (
                <Card title="Recommendations" icon={TrendingUp}>
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        Found {recommendations.total_found} recommendations for
                        article: {recommendations.article_id}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {recommendations.recommendations.map((rec, index) => (
                        <div
                          key={rec.id}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 line-clamp-2">
                              {rec.title}
                            </h4>
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {(rec.similarity_score * 100).toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">ID: {rec.id}</p>
                          {rec.province && (
                            <p className="text-xs text-gray-500">
                              {rec.city}, {rec.province}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {/* Article Info */}
              {articleInfo && (
                <Card title="Article Information" icon={Eye}>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {articleInfo.article.title}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          ID
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {articleInfo.article.id}
                        </p>
                      </div>

                      {articleInfo.article.province && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Location
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {articleInfo.article.city},{" "}
                            {articleInfo.article.province}
                          </p>
                        </div>
                      )}

                      {articleInfo.article.engagement_score && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Engagement Score
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {articleInfo.article.engagement_score}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Retrieved At
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatDateTime(articleInfo.retrieved_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* System Information */}
          <div className="mt-8">
            <Card title="System Information" icon={Server}>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Status
                    </label>
                    <StatusBadge
                      status={
                        healthData?.status === "healthy"
                          ? "healthy"
                          : "unhealthy"
                      }
                    >
                      {healthData?.status || "Unknown"}
                    </StatusBadge>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Freshness
                    </label>
                    <p className="text-sm text-gray-900">
                      {healthData?.data_freshness || "Unknown"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model Version
                    </label>
                    <p className="text-sm text-gray-900">1.0.0</p>
                  </div>

                  {modelStatus?.model_performance && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Matrix Shape
                        </label>
                        <p className="text-sm text-gray-900">
                          {modelStatus.model_performance.matrix_shape?.join(
                            " × "
                          ) || "N/A"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Similarity
                        </label>
                        <p className="text-sm text-gray-900">
                          {(
                            modelStatus.model_performance.max_similarity * 100
                          ).toFixed(2)}
                          %
                        </p>
                      </div>
                    </>
                  )}

                  {metrics?.data_changes_detected !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Changes
                      </label>
                      <p className="text-sm text-gray-900">
                        {metrics.data_changes_detected}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
