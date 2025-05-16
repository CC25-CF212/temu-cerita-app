"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideMenu() {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full h-full bg-emerald-700 text-white p-4">
      <h2 className="text-xl font-semibold mb-4">Admin</h2>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-white bg-opacity-20 rounded-md px-3 py-2 text-white placeholder-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="absolute right-2 top-2 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-300 mb-2">Main Menu</h3>
        <ul>
          <li className="mb-2">
            <Link
              href="/dashboard"
              className={`flex items-center ${
                pathname === "/dashboard" ? "bg-emerald-800" : ""
              } hover:bg-emerald-800 rounded-md p-2 transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/article"
              className={`flex items-center ${
                pathname === "/article" ? "bg-emerald-800" : ""
              } hover:bg-emerald-800 rounded-md p-2 transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Article
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/user"
              className={`flex items-center ${
                pathname === "/user" ? "bg-emerald-800" : ""
              } hover:bg-emerald-800 rounded-md p-2 transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              User
            </Link>
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-300 mb-2">Setting</h3>
        <ul>
          <li className="mb-2">
            <Link
              href="/user/setting"
              className={`flex items-center ${
                pathname === "/setting/user" ? "bg-emerald-800" : ""
              } hover:bg-emerald-800 rounded-md p-2 transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              User
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-auto">
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full transition-colors">
          Logout
        </button>
      </div>
    </div>
  );
}
