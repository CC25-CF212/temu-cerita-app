"use client";

import SideMenu from "@/components/SideMenu";
import { userService } from "@/lib/userService";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// Confirmation Modal Component
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
        <div className="flex justify-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {cancelText || "Batal"}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {confirmText || "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal Component for Add/Edit User
function UserModal({ isOpen, onClose, user, onSave, mode }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_picture: "",
    active: true,
    admin: false,
  });

  useEffect(() => {
    if (user && mode === "edit") {
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // Don't show existing password
        profile_picture: user.profile_picture || "",
        active: user.isActive ?? user.active,
        admin: user.isAdmin ?? user.admin,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        profile_picture: "",
        active: true,
        admin: false,
      });
    }
  }, [user, mode, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Nama dan email harus diisi!");
      return;
    }
    if (mode === "add" && !formData.password) {
      alert("Password harus diisi untuk user baru!");
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {mode === "edit" ? "Edit User" : "Tambah User Baru"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password {mode === "add" ? "*" : "(kosongkan jika tidak diubah)"}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required={mode === "add"}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture URL
            </label>
            <input
              type="url"
              value={formData.profile_picture}
              onChange={(e) =>
                setFormData({ ...formData, profile_picture: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-gray-700">
                User Aktif
              </span>
            </label>
          </div>
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.admin}
                onChange={(e) =>
                  setFormData({ ...formData, admin: e.target.checked })
                }
                className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </label>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              {mode === "edit" ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Notification Component
function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-md shadow-lg z-50`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const usersPerPage = 10;
  const [sideMenuContainer, setSideMenuContainer] = useState(null);

  useEffect(() => {
    const container = document.getElementById("sidemenu-container");
    setSideMenuContainer(container);
  }, []);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Function to load users from API
  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await userService.getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error("Error loading users:", error);
      showNotification("Gagal memuat data user!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Function to show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfFirstUser + usersPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle add new user
  const handleAddUser = () => {
    setModalMode("add");
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // Handle edit user
  const handleEdit = (user) => {
    setModalMode("edit");
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Handle delete user
  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Confirm delete user
  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await userService.deleteUser(userToDelete.id);
        showNotification("User berhasil dihapus!", "success");

        // Reload users after deletion
        await loadUsers();

        // Adjust current page if needed
        const newTotalPages = Math.ceil((users.length - 1) / usersPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        showNotification("Gagal menghapus user!", "error");
      }
    }

    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  // Handle save user (add or edit)
  const handleSaveUser = async (formData) => {
    try {
      if (modalMode === "edit" && editingUser) {
        // Update existing user
        const updateData = {
          name: formData.name,
          email: formData.email,
          profile_picture: formData.profile_picture || "",
        };

        await userService.updateUser(editingUser.id, updateData);

        // Handle admin status if changed
        const currentAdminStatus = editingUser.isAdmin ?? editingUser.admin;
        if (formData.admin !== currentAdminStatus) {
          await userService.setAdminStatus(editingUser.id, formData.admin);
        }

        // Handle active status if changed
        const currentActiveStatus = editingUser.isActive ?? editingUser.active;
        if (formData.active !== currentActiveStatus) {
          await userService.toggleUserActive(editingUser.id);
        }

        showNotification("User berhasil diupdate!", "success");
      } else {
        // Add new user
        const createData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          profile_picture: formData.profile_picture || "",
          // isActive: formData.active,
          // isAdmin: formData.admin,
          // Add other fields as needed
        };
        console.log("Creating user with data:", createData);
        const newUser = await userService.createUser(createData);

        // Set admin status if needed
        if (formData.admin) {
          await userService.setAdminStatus(newUser.id, true);
        }

        // Set active status if needed (assuming new users are active by default)
        if (!formData.active) {
          await userService.toggleUserActive(newUser.id);
        }

        showNotification("User berhasil ditambahkan!", "success");
      }

      // Reload users after save
      await loadUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      showNotification("Gagal menyimpan user!", "error");
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (user) => {
    try {
      await userService.toggleUserActive(user.id);
      showNotification("Status user berhasil diubah!", "success");
      await loadUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
      showNotification("Gagal mengubah status user!", "error");
    }
  };

  // Handle toggle admin status
  const handleToggleAdmin = async (user) => {
    try {
      const currentAdminStatus = user.isAdmin ?? user.admin;
      await userService.setAdminStatus(user.id, !currentAdminStatus);
      showNotification("Status admin berhasil diubah!", "success");
      await loadUsers();
    } catch (error) {
      console.error("Error toggling admin status:", error);
      showNotification("Gagal mengubah status admin!", "error");
    }
  };

  if (loading) {
    return (
      <>
        {sideMenuContainer && createPortal(<SideMenu />, sideMenuContainer)}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      {sideMenuContainer && createPortal(<SideMenu />, sideMenuContainer)}

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Hapus User"
        message={`Apakah Anda yakin ingin menghapus user "${userToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
        onSave={handleSaveUser}
        mode={modalMode}
      />

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold mb-6">User</h1>
        <div className="flex items-center">
          <button
            onClick={handleAddUser}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Tambah Data</span>
          </button>
        </div>
      </div>

      <div className="mb-4 relative w-64">
        <input
          type="text"
          placeholder="Search users..."
          className="border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
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
                  Profile Picture
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Active Date
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
                    {indexOfFirstUser + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = "/images/gambar.png";
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${
                        user.isActive ?? user.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ?? user.active ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleToggleAdmin(user)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${
                        user.isAdmin ?? user.admin
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.isAdmin ?? user.admin ? "Admin" : "User"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("id-ID")
                      : user.created_at
                      ? new Date(user.createdAt).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs flex items-center space-x-1"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs flex items-center space-x-1"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
