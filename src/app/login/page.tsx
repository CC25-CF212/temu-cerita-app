"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import your AttendanceSystem component
const AttendanceSystem = dynamic(
  () => import("@/components/AttendanceSystem"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-blue-700">
            Memuat Sistem Absensi...
          </p>
        </div>
      </div>
    ),
  }
);

// Fallback component for Suspense
function AttendanceFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-blue-700">
          Memuat Sistem Absensi...
        </p>
      </div>
    </div>
  );
}

export default function AttendanceLoader() {
  return (
    <Suspense fallback={<AttendanceFallback />}>
      <AttendanceSystem />
    </Suspense>
  );
}
