// /components/auth-check.js
"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Component to check authentication status
 * Use this in client components where you need to protect content
 */
export function AuthCheck({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLoading = status === "loading";

  useEffect(() => {
    // If the session is loading, do nothing
    if (isLoading) return;

    // If no session exists, redirect to login
    if (!session) {
      // Store the current path as the redirect destination
      router.push(`/pages/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [session, isLoading, router, pathname]);

  // While loading, show nothing or a loading state
  if (isLoading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render the children
  return <>{children}</>;
}
