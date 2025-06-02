"use client";
import Header from "../../../components/pages/components/layout/Header";
import Footer from "../../../components/pages/components/layout/Footer";
import CategoryPage from "../../../components/pages/components/kategori/CategoryPage";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Loading component untuk konsistensi UI
function CategoryLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading categories...</p>
      </div>
    </div>
  );
}

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

  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryPage />
    </Suspense>
  );
}

export default function Category() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<CategoryLoading />}>
          <CategoryContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
