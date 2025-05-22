"use client";

import TemuCeritaChat from "@/components/pages/components/TemuCeritaChat";
import { AuthProvider } from "@/context/AuthContext";
import { ReactNode } from "react";

export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthProvider>
        {children}
        <TemuCeritaChat darkMode={false} />
      </AuthProvider>
    </>
  );
}
