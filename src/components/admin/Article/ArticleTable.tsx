"use client";

import { Article } from "@/lib/types";
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
  MapPin,
  Heart,
  MessageCircle,
  CheckCircle,
  XCircle,
  Check,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface ArticleTableProps {
  articles: Article[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange?: (page: number) => void;
  loading?: boolean;
  onDataRefresh?: () => void;
}

export default function ArticleTable({
  articles,
  pagination,
  onPageChange,
  loading = false,
  onDataRefresh,
}: ArticleTableProps) {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedArticleTitle, setSelectedArticleTitle] = useState<string>("");

  const handleDeleteClick = (id: string, title: string) => {
    setSelectedArticleId(id);
    setSelectedArticleTitle(title);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticleId(null);
  };

  const handleDeleteSuccess = () => {
    console.log("Artikel berhasil dihapus / dinonaktifkan");
    // Call refresh callback instead of page reload
    if (onDataRefresh) {
      onDataRefresh();
    } else {
      window.location.reload();
    }
  };

  const handleEditArticle = (id: string) => {
    router.push(`/admin/article/post/${id}`);
  };

  const handleViewArticle = (id: string) => {
    window.open(`/pages/article/detail/${id}`, "_blank");
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

  // Generate pagination numbers with proper logic
  console.log("Generating pagination numbers", { pagination });
  const generatePaginationNumbers = () => {
    if (!pagination) return [];
    
    const { currentPage, totalPages } = pagination;
    const pages = [];
    
    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 4) {
        // Show pages 2, 3, 4, 5, ..., last
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show 1, ..., last-4, last-3, last-2, last-1, last
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show 1, ..., current-1, current, current+1, ..., last
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...', totalPages);
      }
    }
    
    return pages;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mt-2"></div>
        </div>
        <div className="p-4 sm:p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-2 sm:space-x-4 py-4 border-b border-gray-100"
            >
              <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
              <div className="hidden sm:block h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="hidden md:block h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              <div className="hidden lg:block h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="flex space-x-1 sm:space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="hidden sm:block h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="hidden sm:block h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-emerald-600" />
          Daftar Artikel
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Total {pagination?.totalItems || articles.length} artikel tersedia
        </p>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden">
        <div className="divide-y divide-gray-200">
          {articles.map((article, index) => {
            const pageStart = pagination
              ? (pagination.currentPage - 1) * pagination.itemsPerPage
              : 0;
            return (
              <div key={article.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-500">
                        #{pageStart + index + 1}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        article.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {article.active ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                      {article.title}
                    </h3>
                    
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {article.author.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {article.city}, {article.province}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <div className="flex items-center gap-1 text-red-600">
                        <Heart className="w-3 h-3" />
                        {article.likes}
                      </div>
                      <div className="flex items-center gap-1 text-blue-600">
                        <MessageCircle className="w-3 h-3" />
                        {article.comments}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 ml-4">
                    <button
                      onClick={() => handleViewArticle(article.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                      title="Lihat artikel"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditArticle(article.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                      title="Edit artikel"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(article.id, article.title)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                      title="Hapus artikel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-80">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Artikel
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Penulis
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Lokasi
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Stats
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Status
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article, index) => {
              const pageStart = pagination
                ? (pagination.currentPage - 1) * pagination.itemsPerPage
                : 0;
              return (
                <tr
                  key={article.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pageStart + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs">
                      <p className="font-medium truncate" title={article.title}>
                        {article.title}
                      </p>
                      <p
                        className="text-gray-500 text-xs truncate mt-1"
                        title={article.description}
                      >
                        {article.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-medium text-xs">
                          {article.author?.name?.charAt(0)?.toUpperCase() || "A"}
                        </span>
                      </div>
                      <span className="truncate">{article.author.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 truncate">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="text-xs">
                      <div className="font-medium truncate">{article.city}</div>
                      <div className="text-gray-500 truncate">{article.province}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1 text-red-600">
                        <Heart className="w-3 h-3" />
                        {article.likes}
                      </div>
                      <div className="flex items-center gap-1 text-blue-600">
                        <MessageCircle className="w-3 h-3" />
                        {article.comments}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-1 text-xs">
                      {article.active ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-600">Aktif</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-red-600">Nonaktif</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(article.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => handleViewArticle(article.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                        title="Lihat artikel"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditArticle(article.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                        title="Edit artikel"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(article.id, article.title)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                        title="Hapus artikel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {articles.length === 0 && !loading && (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada artikel tersedia</p>
        </div>
      )}

      {/* Improved Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700 order-2 sm:order-1">
              Menampilkan{" "}
              <span className="font-medium">
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
              </span>{" "}
              -{" "}
              <span className="font-medium">
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems
                )}
              </span>{" "}
              dari{" "}
              <span className="font-medium">{pagination.totalItems}</span> artikel
            </div>

            <div className="flex items-center space-x-1 order-1 sm:order-2">
              {/* Previous Button */}
              <button
                onClick={() => {
                  if (pagination.currentPage > 1 && onPageChange) {
                    onPageChange(pagination.currentPage - 1);
                  }
                }}
                disabled={pagination.currentPage === 1}
                className="inline-flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {generatePaginationNumbers().map((pageNum, index) => {
                  if (pageNum === '...') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        if (typeof pageNum === 'number' && onPageChange) {
                          onPageChange(pageNum);
                        }
                      }}
                      className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                        pagination.currentPage === pageNum
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
                onClick={() => {
                  if (pagination.currentPage < pagination.totalPages && onPageChange) {
                    onPageChange(pagination.currentPage + 1);
                  }
                }}
                disabled={pagination.currentPage === pagination.totalPages}
                className="inline-flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4 sm:ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedArticleId && (
        <DeleteConfirmationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          articleId={selectedArticleId}
          articleTitle={selectedArticleTitle}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}