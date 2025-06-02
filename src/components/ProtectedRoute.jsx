import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";

export function ProtectedRoute({ children, adminOnly = false }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin());

  if (!isAuthenticated) {
    redirect("/login");
  }
  if (adminOnly && !isAdmin) {
    redirect("/unauthorized");
  }

  return children;
}
