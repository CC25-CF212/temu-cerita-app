"use client";

import UserCard from "@/components/admin/Dashboard/UserCard";
import SideMenu from "@/components/SideMenu";
import { mockCategories, yearlyArticles } from "@/data/mockData";
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

  useEffect(() => {
    // Find the container after component mounts
    const container = document.getElementById("sidemenu-container");
    setSideMenuContainer(container);
  }, []);

  return (
    <div>
      {/* Use React Portal to render SideMenu in the external container */}
      {sideMenuContainer && createPortal(<SideMenu />, sideMenuContainer)}

      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <UserCard count={500} />
        </div>
      </div>

      <CategoryChart categories={mockCategories} />

      <ArticleChart years={yearlyArticles.years} data={yearlyArticles.data} />

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
