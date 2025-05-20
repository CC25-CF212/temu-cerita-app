// File: components/Article/ArticleList.tsx
import React from "react";
import Link from "next/link";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";

interface Article {
  id: string | number;
  title: string;
  thumbnail: string;
  category: string;
  createdAt: string;
}

interface ArticleListProps {
  articles: Article[];
  onDelete: (id: string | number) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold">Articles</h2>
        <Link href="/admin/article/add">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
            Add Article
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created At
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.length > 0 ? (
              articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-16 bg-gray-200 rounded">
                        {article.thumbnail && (
                          <img
                            className="h-10 w-16 object-cover rounded"
                            src={article.thumbnail}
                            alt={article.title}
                          />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {article.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/article/view/${article.id}`}>
                        <button className="p-1 text-blue-600 hover:text-blue-900">
                          <FiEye size={18} />
                        </button>
                      </Link>
                      <Link href={`/admin/article/edit/${article.id}`}>
                        <button className="p-1 text-yellow-600 hover:text-yellow-900">
                          <FiEdit size={18} />
                        </button>
                      </Link>
                      <button
                        onClick={() => onDelete(article.id)}
                        className="p-1 text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No articles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticleList;
