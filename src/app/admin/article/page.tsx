"use client";

import ArticleTable from "@/components/admin/Article/ArticleTable";
import SideMenu from "@/components/SideMenu";
import { mockArticles } from "@/data/mockData";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ArticlePage() {
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

      <h1 className="text-2xl font-bold mb-6">Article</h1>
      <ArticleTable articles={mockArticles} />
    </div>
  );
}
