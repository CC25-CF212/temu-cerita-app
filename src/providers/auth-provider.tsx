// "use client";

// import { SessionProvider } from "next-auth/react";

// export function AuthProvider({ children }) {
//   return <SessionProvider>{children}</SessionProvider>;
// }

// components/AuthProvider.jsx
// "use client";
// import { SessionProvider } from "next-auth/react";
// import { useAuthIntegration } from "@/hooks/useAuthIntegration";

// function AuthSyncComponent({ children }) {
//   // Hook ini akan menjalankan sinkronisasi otomatis
//   useAuthIntegration();
//   return children;
// }

// export function AuthProvider({ children, session }) {
//   return (
//     <SessionProvider session={session}>
//       <AuthSyncComponent>{children}</AuthSyncComponent>
//     </SessionProvider>
//   );
// }

"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { useAuthIntegration } from "@/hooks/useAuthIntegration";

interface AuthProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

function AuthSyncComponent({ children }: { children: React.ReactNode }) {
  useAuthIntegration(); // Sinkronisasi otomatis
  return <>{children}</>;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session}>
      <AuthSyncComponent>{children}</AuthSyncComponent>
    </SessionProvider>
  );
}
