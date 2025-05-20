import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppLayout from "./AppLayout"; // komponen client
import { AuthProvider } from "../providers/auth-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Temu Cerita",
  description: "Admin dashboard for TemuCerita",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
