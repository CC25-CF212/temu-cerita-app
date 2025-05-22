// components/ImageGridGallery.jsx
import { useState } from "react";
import Image from "next/image";
import FullscreenGallery from "./FullscreenGallery";

const ImageGridGallery = ({
  images,
  columns = 3,
  gap = 4,
  aspectRatio = "square",
}) => {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  // Open fullscreen gallery with the clicked image
  const openFullscreen = (index) => {
    setFullscreenIndex(index);
    setFullscreenOpen(true);
  };

  // Close fullscreen gallery
  const closeFullscreen = () => {
    setFullscreenOpen(false);
  };

  // Determine the aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "portrait":
        return "aspect-[3/4]";
      case "panorama":
        return "aspect-[2/1]";
      default:
        return "aspect-square";
    }
  };

  // Calculate the appropriate gap class
  const getGapClass = () => {
    const gapSizes = {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
    };
    return gapSizes[gap] || "gap-4";
  };

  // Calculate the appropriate grid columns class
  const getColumnsClass = () => {
    const columnClasses = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
      6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    };
    return (
      columnClasses[columns] || "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
    );
  };

  return (
    <div className="w-full">
      <div className={`grid ${getColumnsClass()} ${getGapClass()}`}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-lg bg-gray-100 ${getAspectRatioClass()}`}
            onClick={() => openFullscreen(index)}
          >
            <Image
              src={image.src}
              alt={image.alt || `Image ${index + 1}`}
              fill
              className="cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Hover overlay with caption */}
            {image.caption && (
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-sm font-medium text-white">
                  {image.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Gallery Modal */}
      {fullscreenOpen && (
        <FullscreenGallery
          images={images}
          initialIndex={fullscreenIndex}
          onClose={closeFullscreen}
        />
      )}
    </div>
  );
};

export default ImageGridGallery;
