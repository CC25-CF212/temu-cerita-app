"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";

// Logout Confirmation Modal Component
const LogoutConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-green-100 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-600"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Konfirmasi Logout
            </h3>
            <p className="text-gray-600 mt-1">
              Apakah Anda yakin ingin keluar?
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          Anda akan diarahkan kembali ke halaman login.
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center min-w-20 justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Keluar...</span>
              </div>
            ) : (
              "Ya, Keluar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SideMenu() {
  const pathname = usePathname();
  const router = useRouter();
  // const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);

    try {
      // Sign out from NextAuth
      await signOut({ redirect: false });

      // Clear auth context
      // logout();

      // Redirect to login page
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, still redirect to login
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
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
                href="/admin/dashboard"
                className={`flex items-center ${
                  pathname === "/admin/dashboard" ? "bg-emerald-800" : ""
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
                href="/admin/article"
                className={`flex items-center ${
                  pathname === "/admin/article" ? "bg-emerald-800" : ""
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
                href="/admin/user"
                className={`flex items-center ${
                  pathname === "/admin/user" ? "bg-emerald-800" : ""
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
                href="/admin/user/setting"
                className={`flex items-center ${
                  pathname === "/admin/user/setting" ? "bg-emerald-800" : ""
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
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        isLoading={isLoggingOut}
      />
    </>
  );
}
