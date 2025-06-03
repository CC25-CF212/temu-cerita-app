// import { useAuthStore } from "@/store/authStore";
// import { redirect } from "next/navigation";

// export function ProtectedRoute({ children, adminOnly = false }) {
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
//   const isAdmin = useAuthStore((state) => state.isAdmin());

//   if (!isAuthenticated) {
//     redirect("/login");
//   }
//   if (adminOnly && !isAdmin) {
//     redirect("/unauthorized");
//   }

//   return children;
// }

import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children, adminOnly = false }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const isLoading = useAuthStore((state) => state.isLoading); // Tambahkan state loading dari store

  // Atau jika tidak ada isLoading di store, buat state lokal
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulasi inisialisasi auth state
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Tampilkan loading jika auth state belum ter-load
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Redirect setelah state ter-load dan user tidak authenticated
  if (!isAuthenticated) {
    redirect("/login");
  }

  // Redirect jika butuh admin access tapi user bukan admin
  if (adminOnly && !isAdmin) {
    redirect("/unauthorized");
  }

  return children;
}
