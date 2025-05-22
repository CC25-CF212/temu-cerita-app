"use client";

import SideMenu from "@/components/SideMenu";
import { mockUsers } from "@/data/mockData";
import { useState, useEffect, SetStateAction } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";

export default function UserPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [sideMenuContainer, setSideMenuContainer] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    // Find the container after component mounts
    const container = document.getElementById("sidemenu-container");
    setSideMenuContainer(container);
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  function handleDelete(id: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      {/* Use React Portal to render SideMenu in the external container */}
      {sideMenuContainer && createPortal(<SideMenu />, sideMenuContainer)}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold mb-6">User</h1>
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md shadow-sm p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Active
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentUsers.map((user, index) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {" "}
                    {indexOfFirstUser + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {user.activeDate}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(user.id)}
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
    </>
  );
}
