"use client";

import TemuCeritaChat from "@/components/pages/components/TemuCeritaChat";
import RouterProgress from "@/components/RouterProgress";
import { AuthProvider } from "@/context/AuthContext";
import { useRouterProgress } from "@/hooks/useRouterProgress";
import { ReactNode } from "react";

export default function PagesLayout({ children }: { children: ReactNode }) {
  //useRouterProgress();
  return (
    <>
      <AuthProvider>
        <RouterProgress />
        {children}
        <TemuCeritaChat darkMode={false} />
      </AuthProvider>
    </>
  );
}
