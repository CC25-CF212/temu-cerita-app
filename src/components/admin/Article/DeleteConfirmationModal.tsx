import React, { useState } from "react";
import {
  AlertTriangle,
  Trash2,
  EyeOff,
  X,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleTitle: string;
  articleId: string;
  onDeleteSuccess: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  articleTitle,
  articleId,
  onDeleteSuccess,
}: DeleteConfirmationModalProps) {
  const [loading, setLoading] = useState(false);
  const [deleteType, setDeleteType] = useState<"soft" | "hard" | null>(null);

  if (!isOpen) return null;

  const handleSoftDelete = async () => {
    setLoading(true);
    setDeleteType("soft");

    try {
      const response = await fetch(`/api/articles/${articleId}/soft-delete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: false }),
      });

      if (response.ok) {
        // Success - refresh data without reload
        onDeleteSuccess();
        onClose();

        // Show success toast (optional)
        showToast("Artikel berhasil dinonaktifkan", "success");
      } else {
        throw new Error("Gagal menonaktifkan artikel");
      }
    } catch (error) {
      console.error("Error soft deleting article:", error);
      showToast("Terjadi kesalahan saat menonaktifkan artikel", "error");
    } finally {
      setLoading(false);
      setDeleteType(null);
    }
  };

  const handleHardDelete = async () => {
    setLoading(true);
    setDeleteType("hard");

    try {
    const response = await fetch(`/api/articles/${articleId}/hard-delete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: false }),
      });

      if (response.ok) {
        // Success - refresh data without reload
        onDeleteSuccess();
        onClose();

        // Show success toast (optional)
        showToast("Artikel berhasil dihapus permanen", "success");
      } else {
        throw new Error("Gagal menghapus artikel");
      }
    } catch (error) {
      console.error("Error hard deleting article:", error);
      showToast("Terjadi kesalahan saat menghapus artikel", "error");
    } finally {
      setLoading(false);
      setDeleteType(null);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    // Simple toast implementation - you can replace with your preferred toast library
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${
      type === "success" ? "bg-green-600" : "bg-red-600"
    }`;
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        ${
          type === "success"
            ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>'
            : '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>'
        }
        <span class="text-sm font-medium">${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Konfirmasi Hapus Artikel
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Pilih jenis penghapusan untuk artikel ini
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Artikel yang akan diproses:
              </p>
              <p className="font-medium text-gray-900 text-sm leading-relaxed">
                "{articleTitle}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Soft Delete */}
              <button
                onClick={handleSoftDelete}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && deleteType === "soft" ? (
                  <Loader2 className="w-5 h-5 animate-spin text-yellow-600" />
                ) : (
                  <EyeOff className="w-5 h-5 text-yellow-600 group-hover:scale-110 transition-transform" />
                )}
                <div className="text-left flex-1">
                  <div className="font-medium text-yellow-800">
                    {loading && deleteType === "soft"
                      ? "Menonaktifkan..."
                      : "Nonaktifkan Artikel"}
                  </div>
                  <div className="text-xs text-yellow-600">
                    Artikel disembunyikan tapi data tetap tersimpan
                  </div>
                </div>
              </button>

              {/* Hard Delete */}
              <button
                onClick={handleHardDelete}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && deleteType === "hard" ? (
                  <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                ) : (
                  <Trash2 className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
                )}
                <div className="text-left flex-1">
                  <div className="font-medium text-red-800">
                    {loading && deleteType === "hard"
                      ? "Menghapus..."
                      : "Hapus Permanen"}
                  </div>
                  <div className="text-xs text-red-600">
                    Artikel dan semua referensinya akan dihapus total
                  </div>
                </div>
              </button>
            </div>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full mt-4 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
          </div>

          {/* Warning Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-2xl">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Perhatian:</strong> Penghapusan permanen tidak dapat
                dibatalkan. Pastikan Anda telah mempertimbangkan pilihan dengan
                matang.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
