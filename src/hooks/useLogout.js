// hooks/useLogout.js
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useLogout = (redirectTo = "/login") => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);

    try {
      // Sign out from NextAuth
      await signOut({ redirect: true, callbackUrl: redirectTo });

      // Clear auth context if needed
      // logout();

      // Redirect to login page
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, still redirect to login
      router.push(redirectTo);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return {
    showLogoutModal,
    isLoggingOut,
    handleLogoutClick,
    handleLogoutConfirm,
    handleLogoutCancel,
  };
};
