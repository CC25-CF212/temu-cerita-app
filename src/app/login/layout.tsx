"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ReactNode, useEffect, useState } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
