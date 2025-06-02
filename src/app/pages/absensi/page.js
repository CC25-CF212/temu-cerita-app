"use client";

import dynamic from "next/dynamic";
// Loading component
function AttendanceLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-blue-700">
          Memuat Sistem Absensi...
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Menyiapkan kamera dan lokasi...
        </p>
      </div>
    </div>
  );
}

// Dynamically import the AttendanceSystem with no SSR
const AttendanceSystem = dynamic(
  () => import("@/components/AttendanceSystem"),
  {
    ssr: false,
    loading: () => <AttendanceLoadingFallback />,
  }
);

export default function AbsensiPage() {
  return <AttendanceSystem />;
}
