"use client";

import ArticleTable from "@/components/admin/Article/ArticleTable";
import SideMenu from "@/components/SideMenu";
import { mockArticles } from "@/data/mockData";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";

export default function ArticlePage() {
  // Render SideMenu hanya di client
  useEffect(() => {
    const container = document.getElementById("sidemenu-container");
    if (container && container.childNodes.length === 0) {
      const root = createRoot(container);
      root.render(<SideMenu />);
    }
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Article</h1>
      <ArticleTable articles={mockArticles} />
    </div>
  );
}
