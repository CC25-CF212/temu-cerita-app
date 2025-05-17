"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [is404, setIs404] = useState(false);

  useEffect(() => {
    // Cek kalau children punya elemen dengan attribute data-is404
    const el = document.querySelector("[data-is404='true']");
    setIs404(!!el);
  }, [pathname]);

  // Jika di halaman login, tampilkan hanya children tanpa layout
  const noLayoutPaths = ["/admin/login", "/register", "/forgot-password"];

  if (
    noLayoutPaths.includes(pathname) ||
    pathname.startsWith("/pages") ||
    is404
  ) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="bg-emerald-100 py-4 px-6 sticky top-0 z-50 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">TemuCerita</h1>
      </header>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 bg-emerald-700">
          <div className="md:fixed md:h-screen md:w-64">
            <div className="h-full">
              {/* SideMenu will be rendered client-side */}
              <div id="sidemenu-container" className="h-full" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
