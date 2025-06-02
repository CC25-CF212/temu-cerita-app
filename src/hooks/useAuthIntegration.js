// hooks/useAuthIntegration.js
import { useSession, getProviders } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export function useAuthIntegration() {
  const { data: session, status } = useSession();
  const { setAuth, logout, setLoading, user, token, isAuthenticated } =
    useAuthStore();

  useEffect(() => {
    // const loadProviders = async () => {
    //   const providers = await getProviders();
    //   console.log("providers", providers);
    // };
    // loadProviders();
    setLoading(status === "loading");

    if (status === "authenticated" && session?.user) {
      console.log("Session authenticated:", session);
      // Sync NextAuth session dengan Zustand store
      setAuth(
        {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          admin: session.user.admin,
        },
        session.user.apiToken
      );
    } else if (status === "unauthenticated") {
      logout();
    }
  }, [session, status, setAuth, logout, setLoading]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading: status === "loading",
    session,
    status,
  };
}
