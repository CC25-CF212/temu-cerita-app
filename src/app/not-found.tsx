"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const animationContainer = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Load Lottie dynamically to avoid SSR issues
    const loadLottie = async () => {
      try {
        // You'll need to install: npm install lottie-web
        const lottie = (await import("lottie-web")).default;

        if (animationContainer.current) {
          // Clear any existing animation
          animationContainer.current.innerHTML = "";

          // Load your JSON animation file
          lottie.loadAnimation({
            container: animationContainer.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            // Put your Lottie JSON file in public/animations/
            path: "/animasi/404.json",
            // Alternative: you can also use animationData instead of path
            // animationData: require('/path/to/your/animation.json'),
          });
        }
      } catch (error) {
        console.error("Failed to load Lottie animation:", error);
        // Fallback: show a simple emoji if Lottie fails
        if (animationContainer.current) {
          animationContainer.current.innerHTML = `
            <div class="text-8xl animate-bounce">🤖</div>
          `;
        }
      }
    };

    loadLottie();
  }, []);

  const handleGoHome = () => {
    router.push("/pages");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center px-4"
      data-is404="true"
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Lottie Animation Container */}
        <div className="mb-8">
          <div
            ref={animationContainer}
            className="w-80 h-80 mx-auto"
            style={{ maxWidth: "320px", maxHeight: "320px" }}
          />
        </div>

        {/* Error Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-6xl font-bold text-gray-900 mb-2">
              4<span className="text-emerald-600">0</span>4
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Oops! Sepertinya halaman yang kamu cari sudah dipindahkan,
              dihapus, atau mungkin tidak pernah ada.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGoHome}
              className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Kembali ke Beranda
            </button>

            <button
              onClick={handleGoBack}
              className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Halaman Sebelumnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
