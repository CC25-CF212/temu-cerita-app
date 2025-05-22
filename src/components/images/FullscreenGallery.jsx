// components/FullscreenGallery.jsx
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

const FullscreenGallery = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  // Handle navigation
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setIsZoomed(false);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key === "z") {
        toggleZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Prevent body scrolling when the modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [currentIndex, isZoomed]);

  // Reset loading state when image changes
  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
        aria-label="Close gallery"
      >
        <X size={24} />
      </button>

      {/* Main image container */}
      <div className="relative h-full w-full p-8">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-white"></div>
          </div>
        )}

        <div
          className="flex h-full items-center justify-center"
          onClick={toggleZoom}
        >
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
            fill
            className={`
              cursor-zoom-in
              transition-all duration-300
              ${isLoading ? "opacity-0" : "opacity-100"} 
              ${isZoomed ? "object-cover" : "object-contain"}
            `}
            onLoadingComplete={() => setIsLoading(false)}
            priority
          />
        </div>
      </div>

      {/* Zoom button */}
      <button
        onClick={toggleZoom}
        className="absolute bottom-4 left-4 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
        aria-label={isZoomed ? "Zoom out" : "Zoom in"}
      >
        {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
      </button>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft size={30} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight size={30} />
          </button>
        </>
      )}

      {/* Caption area */}
      {images[currentIndex]?.caption && (
        <div className="absolute bottom-4 left-1/2 w-full max-w-2xl -translate-x-1/2 rounded bg-black/70 p-3 text-center text-white">
          {images[currentIndex].caption}
        </div>
      )}

      {/* Counter indicator */}
      <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default FullscreenGallery;
