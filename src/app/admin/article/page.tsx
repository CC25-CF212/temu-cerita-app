"use client";

import ArticleTable from "@/components/admin/Article/ArticleTable";
import SideMenu from "@/components/SideMenu";
import { mockArticles } from "@/data/mockData";
import { getArticles } from "@/lib/articleService";
import { Article, ArticlesParams } from "@/lib/types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ArticlePage() {
  const [sideMenuContainer, setSideMenuContainer] =
    useState<HTMLElement | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Filter states
  const [filters, setFilters] = useState<ArticlesParams>({
    page: "1",
    limit: "10",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");

  useEffect(() => {
    const container = document.getElementById("sidemenu-container");
    setSideMenuContainer(container);
  }, []);

  const fetchArticles = async (params: ArticlesParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getArticles(params);

      if (response.success) {
        setArticles(response.data.articles);
        setPagination(response.data.pagination);
      } else {
        setError("Failed to load articles");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(filters);
  }, [filters]);

  const handlePageChange = (page: number) => {
    // setFilters((prev) => ({ ...prev, page: page.toString() }));
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handleFilterChange = () => {
    const newFilters: ArticlesParams = {
      page: "1",
      limit: filters.limit || "10",
    };

    if (selectedCategory) newFilters.category = selectedCategory;
    if (selectedProvince) newFilters.province = selectedProvince;
    // Note: API doesn't support search by title, but you can implement it server-side

    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedProvince("");
    setSearchTerm("");
    setFilters({ page: "1", limit: "10" });
  };

  const handleRefresh = () => {
    fetchArticles(filters);
  };

  return (
    <div>
      {sideMenuContainer && createPortal(<SideMenu />, sideMenuContainer)}
      <h1 className="text-2xl font-bold mb-6">Article</h1>
      <ArticleTable
        articles={articles}
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
}
