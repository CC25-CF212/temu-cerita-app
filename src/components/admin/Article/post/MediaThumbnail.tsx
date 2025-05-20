import React from "react";
import { Film, X } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
}

interface MediaThumbnailProps {
  item: MediaItem;
  index: number;
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  removeMedia: (id: string) => void;
}

const MediaThumbnail: React.FC<MediaThumbnailProps> = ({
  item,
  index,
  currentSlide,
  setCurrentSlide,
  removeMedia,
}) => {
  const handleClick = () => {
    console.log("Thumbnail clicked, setting current slide to:", index);
    setCurrentSlide(index);
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log("Removing media item:", item.id);
    removeMedia(item.id);
  };

  return (
    <div
      className={`relative cursor-pointer flex-shrink-0 ${
        currentSlide === index ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={handleClick}
    >
      {item.type === "image" ? (
        <img
          src={item.url}
          alt={`Thumbnail ${index + 1}`}
          className="h-16 w-16 object-cover rounded-md"
        />
      ) : (
        <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded-md">
          <Film size={24} className="text-gray-600" />
        </div>
      )}
      <button
        onClick={handleRemove}
        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default MediaThumbnail;
