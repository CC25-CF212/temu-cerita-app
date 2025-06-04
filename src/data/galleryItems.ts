"use client";

// Demo data for the gallery
export const galleryItems = [
  {
    type: "image" as const,
    src: "/images/images.jpg",
    alt: "LangGraph Workflow Diagram",
    caption: "",
  },
];

export default function GalleryData() {
  return { galleryItems };
}
