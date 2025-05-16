"use client";

import { Article } from "@/types";
import { useState } from "react";

interface ArticleTableProps {
  articles: Article[];
}

export default function ArticleTable({ articles }: ArticleTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = articles.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(articles.length / itemsPerPage);

  const handleEditArticle = (id: number) => {
    console.log(`Edit article with id: ${id}`);
  };

  const handleDeleteArticle = (id: number) => {
    console.log(`Delete article with id: ${id}`);
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                No
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Write
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Kategori
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Date Post
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((article, index) => (
              <tr key={article.id}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {article.id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {article.title}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {article.author}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {article.category}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {article.datePost}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditArticle(article.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === page
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
