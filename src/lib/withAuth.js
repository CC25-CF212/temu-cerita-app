// /lib/withAuth.js - HOC for protected pages
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Higher Order Component (HOC) to protect pages that require authentication
 * @param {Component} Component - The page component to protect
 */
export default function withAuth(Component) {
  return function AuthComponent(props) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const loading = status === "loading";

    useEffect(() => {
      // If the session is loading, do nothing
      if (loading) return;

      // If no session exists, redirect to login
      if (!session) {
        router.push({
          pathname: "/pages/login",
          query: { returnUrl: router.asPath },
        });
      }
    }, [session, loading, router]);

    // If the session is loading or no session exists, show a loading state
    if (loading || !session) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat...</p>
          </div>
        </div>
      );
    }

    // If session exists, render the page component
    return <Component {...props} />;
  };
}
