"use client";

import { useState, useRef, useEffect } from "react";
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";

// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url: string) => {
  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  const videoId = match && match[2].length === 11 ? match[2] : null;

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Return original URL if it doesn't match YouTube patterns
  return url;
};

// Helper function to extract YouTube thumbnail
const getYouTubeThumbnail = (url: string) => {
  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  const videoId = match && match[2].length === 11 ? match[2] : null;

  if (videoId) {
    // Return the high-quality thumbnail URL
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  // Return a default thumbnail if no ID found
  return "/placeholder-video.jpg";
};

// Define the media item type
interface MediaItem {
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
  isYouTube?: boolean;
}

interface InteractiveGalleryProps {
  galleryItems: MediaItem[];
  className?: string;
}

export default function InteractiveGallery({
  galleryItems,
  className = "",
}: InteractiveGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const mainMediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const currentItem = galleryItems[currentIndex];

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + galleryItems.length) % galleryItems.length
    );
    resetZoom();
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryItems.length);
    resetZoom();
  };

  // Zoom functions
  const zoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel((prev) => prev + 0.5);
    }
  };

  const zoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel((prev) => prev - 0.5);
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  // Apply zoom effect when zoom level changes
  useEffect(() => {
    if (
      mainMediaRef.current &&
      currentItem.type !== "video" &&
      !currentItem.isYouTube
    ) {
      mainMediaRef.current.style.transform = `scale(${zoomLevel})`;
    }
  }, [zoomLevel, currentItem.type, currentItem.isYouTube]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && galleryRef.current) {
      galleryRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable fullscreen mode: ${err.message}`
        );
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      ref={galleryRef}
    >
      {/* Main Display */}
      <div className="relative w-full h-96 md:h-[500px] flex items-center justify-center overflow-hidden">
        {currentItem.type === "image" ? (
          <img
            ref={mainMediaRef as React.RefObject<HTMLImageElement>}
            src={currentItem.src}
            alt={currentItem.alt}
            className="max-w-full max-h-full object-contain transition-transform duration-300"
          />
        ) : currentItem.isYouTube ? (
          <iframe
            src={getYouTubeEmbedUrl(currentItem.src)}
            title={currentItem.alt}
            className="w-full h-full max-w-4xl"
            allowFullScreen
          />
        ) : (
          <video
            ref={mainMediaRef as React.RefObject<HTMLVideoElement>}
            src={currentItem.src}
            controls
            className="max-w-full max-h-full object-contain transition-transform duration-300"
          />
        )}

        {/* Caption */}
        {currentItem.caption && (
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white p-4 transform translate-y-full hover:translate-y-0 transition-transform duration-300">
            <p>{currentItem.caption}</p>
          </div>
        )}
      </div>

      {/* Gallery Controls */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-all duration-300"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={goToNext}
          className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-all duration-300"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>

        {/* Zoom Controls */}
        <div className="absolute bottom-5 right-5 flex gap-2 pointer-events-auto">
          <button
            onClick={zoomIn}
            className="bg-black bg-opacity-50 hover:bg-opacity-80 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
            aria-label="Zoom in"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={zoomOut}
            className="bg-black bg-opacity-50 hover:bg-opacity-80 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
            aria-label="Zoom out"
          >
            <ZoomOut size={20} />
          </button>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-5 right-5 bg-black bg-opacity-50 hover:bg-opacity-80 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-all duration-300"
          aria-label="Toggle fullscreen"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex overflow-x-auto bg-gray-900 p-2 gap-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {galleryItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              resetZoom();
            }}
            className={`flex-none w-20 h-16 cursor-pointer rounded overflow-hidden relative border-2 ${
              index === currentIndex
                ? "border-blue-500 opacity-100"
                : "border-transparent opacity-70"
            } transition-all duration-300`}
          >
            {item.type === "image" ? (
              <img
                src={item.src}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.jpg"; // Default placeholder for broken images
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                {item.isYouTube ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={getYouTubeThumbnail(item.src)}
                      alt={`YouTube Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-video.jpg";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Play size={18} className="text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-red-600 text-white text-xs font-bold px-1 rounded">
                      YT
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center bg-gray-900 w-full h-full">
                    <Play size={18} className="text-white" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
