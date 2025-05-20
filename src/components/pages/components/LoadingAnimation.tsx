"use client";

import dynamic from "next/dynamic";

// Komponen Player Lottie yang diimpor secara dinamis
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

// Komponen LoadingAnimation
export default function LoadingAnimation() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Player
        autoplay
        loop
        src="/animasi/animasi.json"
        style={{ width: "200px", height: "200px" }}
      />
      <p className="mt-4 text-blue-600 font-medium loading-text">
        Mendaftarkan akun Anda...
      </p>
      <p className="mt-2 text-blue-500/70 text-sm">Mohon tunggu sebentar</p>

      <style jsx global>{`
        .loading-text {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
