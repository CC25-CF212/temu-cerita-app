"use client";

import UserCard from "@/components/admin/Dashboard/UserCard";
import SideMenu from "@/components/SideMenu";
import { useDashboard } from "@/hooks/useDashboard";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const CategoryChart = dynamic(
  () => import("@/components/admin/Dashboard/CategoryChart"),
  { ssr: false }
);

const ArticleChart = dynamic(
  () => import("@/components/admin/Dashboard/ArticleChart"),
  { ssr: false }
);

export default function DashboardPage() {
  const [sideMenuContainer, setSideMenuContainer] =
    useState<HTMLElement | null>(null);
  const [yearlyArticles, setYearlyArticles] = useState<{
    years: number[];
    count: number[];
  }>({
    years: [],
    count: [],
  });

  const { data, loading, error, refetch } = useDashboard();

  useEffect(() => {
    // Find the container after component mounts
    const container = document.getElementById("sidemenu-container");
    setSideMenuContainer(container);
    if (data?.articleTimeline) {
      const years = data.articleTimeline.map((item) => Number(item.year));
      const count = data.articleTimeline.map((item) => item.count);
      setYearlyArticles({ years, count });
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }
  return (
    <div>
      {/* Use React Portal to render SideMenu in the external container */}
      {sideMenuContainer && createPortal(<SideMenu />, sideMenuContainer)}

      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <UserCard count={Number(data?.totalUsers)} />
        </div>
      </div>

      <CategoryChart categories={data?.categories} />

      <ArticleChart years={yearlyArticles.years} data={yearlyArticles.count} />

      <div className="flex justify-center mt-4">
        <nav className="flex">
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
}
