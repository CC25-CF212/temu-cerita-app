"use client";

import { Article } from "@/models";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit3,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ArticleTableProps {
  articles: Article[];
}

export default function ArticleTable({ articles }: ArticleTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = articles.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(articles.length / itemsPerPage);

  const handleEditArticle = (id: number) => {
    // Navigate to edit page
    router.push(`/admin/article/post/${id}`);
  };

  const handleDeleteArticle = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      console.log(`Delete article with id: ${id}`);
      // Add your delete logic here
    }
  };

  const handleViewArticle = (id: number) => {
    // Navigate to view article page
    router.push(`/articles/${id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-emerald-600" />
          Daftar Artikel
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Total {articles.length} artikel tersedia
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Title
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Penulis
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((article, index) => (
              <tr
                key={article.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs">
                    <p className="font-medium truncate" title={article.title}>
                      {article.title}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-medium text-xs">
                        {article.author?.charAt(0)?.toUpperCase() || "A"}
                      </span>
                    </div>
                    <span>{article.author}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {article.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(article.datePost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    {/* View Button */}
                    <button
                      onClick={() => handleViewArticle(article.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                      title="Lihat artikel"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditArticle(article.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                      title="Edit artikel"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                      title="Hapus artikel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {articles.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada artikel tersedia</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, articles.length)} dari{" "}
              {articles.length} artikel
            </div>

            <div className="flex items-center space-x-1">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
