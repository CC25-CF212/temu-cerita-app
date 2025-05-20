"use client";

// Demo data for the gallery
export const galleryItems = [
  {
    type: "image" as const,
    src: "/images/teo.jpg",
    alt: "LangGraph Workflow Diagram",
    caption:
      "LangGraph workflow diagram showing integration with BigQuery and Gemini",
  },
  {
    type: "image" as const,
    src: "/images/robil.jpeg",
    alt: "BigQuery Data Model",
    caption: "Data model structure in BigQuery",
  },
  {
    type: "video" as const,
    src: "https://www.youtube.com/watch?v=-VmLucfN8PQ",
    alt: "Demo Video",
    caption: "Video demonstration of the LangGraph workflow",
    isYouTube: true,
  },
  {
    type: "image" as const,
    src: "/images/Apipah.jpg",
    alt: "Gemini Integration",
    caption: "Gemini API integration with workflow",
  },
  {
    type: "video" as const,
    src: "https://www.youtube.com/watch?v=lq55cEH_Vgg",
    alt: "Tutorial Video",
    caption: "Step-by-step tutorial on implementing the workflow",
    isYouTube: true,
  },
  {
    type: "image" as const,
    src: "/images/debi.jpeg",
    alt: "Final Architecture",
    caption: "Complete architecture diagram of the solution",
  },
];

export default function GalleryData() {
  return { galleryItems };
}
