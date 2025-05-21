"use client";
import Header from "../../../components/pages/components/layout/Header";
import Footer from "../../../components/pages/components/layout/Footer";
import CategoryPage from "../../../components/pages/components/kategori/CategoryPage";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Create a client component that uses searchParams
function CategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    // If no category is specified, default to "All"
    if (!category) {
      router.push("/pages/kategori?category=All");
    }
  }, [category, router]);

  return <CategoryPage />;
}

export default function Category() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense
        fallback={
          <div className="flex justify-center py-10">Loading categories...</div>
        }
      >
        <CategoryContent />
      </Suspense>
      <Footer />
    </div>
  );
}
