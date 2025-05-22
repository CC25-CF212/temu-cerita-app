// components/ImageGallery.jsx
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [activeImage, setActiveImage] = useState(null);
  const containerRef = useRef(null);

  // Handle navigation
  const goToPrevious = () => {
    if (!images || images.length <= 1) return;

    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    if (!images || images.length <= 1) return;

    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    if (slideIndex >= 0 && slideIndex < images?.length) {
      setCurrentIndex(slideIndex);
    }
  };

  // Handle image load completion
  const handleImageLoaded = (src) => {
    setLoadedImages((prev) => ({
      ...prev,
      [src]: true,
    }));
  };

  // Set active image when current index changes
  useEffect(() => {
    if (images && images.length > 0) {
      // Wait for a small delay to ensure component is ready
      const timer = setTimeout(() => {
        setActiveImage(images[currentIndex]);
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, images]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, images?.length]);

  // Return early if no images provided
  if (!images || images.length === 0) {
    return (
      <div className="h-96 w-full bg-gray-100 rounded-lg flex items-center justify-center">
        No images available
      </div>
    );
  }

  // Check if current image is loaded
  const isCurrentImageLoaded = activeImage && loadedImages[activeImage.src];

  return (
    <div className="relative w-full h-full">
      {/* Main image container */}
      <div
        ref={containerRef}
        className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-100"
      >
        {/* Loading spinner - only show when necessary */}
        {activeImage && !isCurrentImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          </div>
        )}

        {/* Images */}
        {images.map((image, index) => {
          const isActive = currentIndex === index;

          return (
            <div
              key={image.src}
              className={`absolute inset-0 transition-opacity duration-300 ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              style={{ display: isActive ? "block" : "none" }}
            >
              <Image
                src={image.src}
                alt={image.alt || `Image ${index + 1}`}
                fill
                className="object-contain"
                onLoadingComplete={() => handleImageLoaded(image.src)}
                priority={index === 0 || index === currentIndex}
                loading={
                  index === 0 || index === currentIndex ? "eager" : "lazy"
                }
              />
            </div>
          );
        })}
      </div>

      {/* Navigation arrows - Improved positioning and z-index */}
      {images.length > 1 && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 flex items-center z-30 px-2"
            onClick={goToPrevious}
          >
            <button
              type="button"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          <div
            className="absolute right-0 top-0 bottom-0 flex items-center z-30 px-2"
            onClick={goToNext}
          >
            <button
              type="button"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </>
      )}

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="mt-2 flex items-center justify-center space-x-2 overflow-x-auto py-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-16 w-16 overflow-hidden rounded-md transition-all ${
                currentIndex === index
                  ? "ring-2 ring-blue-600 ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Go to image ${index + 1}`}
            >
              <Image
                src={image.src}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Caption area */}
      {/* {images[currentIndex]?.caption && (
        <div className="mt-2 text-center text-sm text-gray-600">
          {images[currentIndex].caption}
        </div>
      )} */}

      {/* Counter indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm z-20">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
