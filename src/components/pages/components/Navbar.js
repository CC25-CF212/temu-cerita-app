import { useState, useEffect } from "react";

const Navbar = ({ categories, activeTab, setActiveTab }) => {
  // State untuk animasi transisi
  const [animating, setAnimating] = useState(false);
  // Efek untuk animasi saat tab berubah
  useEffect(() => {
    if (animating) {
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 300); // Durasi animasi
      return () => clearTimeout(timer);
    }
  }, [animating]);

  // Handler untuk perubahan tab
  const handleTabChange = (category) => {
    if (category !== activeTab) {
      setAnimating(true);
      setActiveTab(category);
    }
  };
  const handleTabChangeKategori = (category) => {
    if (category === "All") {
      console.log("Pindah ke halaman kategori");
      // Misal kasih delay dulu sebelum pindah halaman supaya animasi jalan
      setTimeout(() => {
        // router.push("/pages/kategori");
        window.location.href = "/pages/kategori";
      }, 300); // durasi delay sama dengan animasi
    }
  };

  return (
    <nav className="border-b border-gray-200 mb-4">
      <ul className="flex overflow-x-auto hide-scrollbar">
        {categories.map((category) => (
          <li key={category} className="mr-8 whitespace-nowrap">
            <button
              onClick={() => handleTabChange(category)}
              className={`py-4 relative transition-all duration-300 ${
                activeTab === category
                  ? "font-semibold text-black"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {category}
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 transform transition-all duration-300 ${
                  activeTab === category
                    ? "bg-black scale-x-100"
                    : "bg-transparent scale-x-0"
                }`}
              ></span>
            </button>
          </li>
        ))}
        {/* Tab tambahan di luar map */}
        <li className="mr-8 whitespace-nowrap">
          <button
            onClick={() => handleTabChangeKategori("All")}
            className={`py-4 relative transition-all duration-300 ${
              activeTab === "All"
                ? "font-semibold text-black"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Categories
            <span
              className={`absolute bottom-0 left-0 w-full h-0.5 transform transition-all duration-300 ${
                activeTab === "All"
                  ? "bg-black scale-x-100"
                  : "bg-transparent scale-x-0"
              }`}
            ></span>
          </button>
        </li>
      </ul>

      {/* Indikator konten sedang berganti */}
      {animating && (
        <div className="w-full h-1 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-pulse"></div>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
