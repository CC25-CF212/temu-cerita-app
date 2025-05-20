import React from "react";
import { Paperclip } from "lucide-react";
import MediaThumbnail from "./MediaThumbnail"; // pastikan path ini sesuai dengan struktur proyekmu

interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
}

interface MediaGalleryProps {
  mediaItems: MediaItem[];
  currentSlide: number;
  setCurrentSlide: (index: number | ((prev: number) => number)) => void;
  removeMedia: (id: string) => void;
  insertMediaToEditor: (media: MediaItem) => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  mediaItems,
  currentSlide,
  setCurrentSlide,
  removeMedia,
  insertMediaToEditor,
}) => {
  if (mediaItems.length === 0) return null;

  return (
    <div className="mb-6 border border-gray-300 rounded-lg bg-white overflow-hidden">
      <div className="relative">
        {/* Current slide */}
        <div className="slider-content h-64 flex items-center justify-center bg-gray-100">
          {mediaItems[currentSlide].type === "image" ? (
            <img
              src={mediaItems[currentSlide].url}
              alt="Uploaded content"
              className="max-h-64 max-w-full object-contain"
            />
          ) : (
            <video
              src={mediaItems[currentSlide].url}
              controls
              className="max-h-64 max-w-full"
            />
          )}
        </div>

        {/* Navigation arrows */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentSlide((prev) =>
                  prev === 0 ? mediaItems.length - 1 : prev - 1
                )
              }
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) =>
                  prev === mediaItems.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex overflow-x-auto p-2 bg-gray-50 gap-2">
        {mediaItems.map((item, index) => (
          <MediaThumbnail
            key={item.id}
            item={item}
            index={index}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            removeMedia={removeMedia}
          />
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end p-2 border-t border-gray-200">
        <button
          onClick={() => {
            console.log(
              "Inserting media into editor:",
              mediaItems[currentSlide]
            );
            insertMediaToEditor(mediaItems[currentSlide]);
          }}
          className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          <Paperclip size={14} className="mr-1" />
          Insert into text
        </button>
      </div>
    </div>
  );
};

export default MediaGallery;
