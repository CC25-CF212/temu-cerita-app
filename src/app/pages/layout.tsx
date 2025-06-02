"use client";

import TemuCeritaChat from "@/components/pages/components/TemuCeritaChat";
import RouterProgress from "@/components/RouterProgress";
import { AuthProvider } from "@/context/AuthContext";
import { ReactNode, Suspense } from "react";

export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthProvider>
        <Suspense fallback={null}>
          <RouterProgress />
        </Suspense>
        {children}
        <TemuCeritaChat darkMode={false} />
      </AuthProvider>
    </>
  );
}
