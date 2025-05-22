// pages/gallery.js
"use client";
import ImageGallery from "../../../components/images/ImageGallery";
import ImageGridGallery from "../../../components/images/ImageGridGallery";

export default function GalleryPage() {
  // Example news images (would typically come from an API or CMS)
  const newsImages = [
    {
      src: "/images/gambar.png",
      alt: "Palestinian citizens in Gaza facing water shortage",
      caption: "Warga Palestina di Gaza Masih Kekurangan Air Bersih",
    },
    {
      src: "/images/gambar.png",
      alt: "Kevin De Bruyne during his farewell match",
      caption: "Emosional, Malam Perpisahan Kevin De Bruyne",
    },
    {
      src: "/images/gambar.png",
      alt: "Trucks at Gaza border during blockade",
      caption: "Tiga Bulan Blokade, Israel Hanya Izinkan Sembilan Truk",
    },
    {
      src: "/images/gambar.png",
      alt: "Aerial view of Gaza during military operation",
      caption: "Dihantui Operasi Militer Besar-Besaran Israel",
    },
  ];

  // Sports images
  const sportsImages = [
    {
      src: "/images/gambar.png",
      alt: "Kevin De Bruyne during his farewell match",
      caption: "Kevin De Bruyne's farewell match at Manchester City",
    },
    {
      src: "/images/gambar.png",
      alt: "Football match in progress",
      caption: "Premier League action",
    },
    {
      src: "/images/gambar.png",
      alt: "Stadium filled with fans",
      caption: "Etihad Stadium packed with Manchester City supporters",
    },
  ];

  // Nature images
  const natureImages = [
    {
      src: "/images/gambar.png",
      alt: "Mountain landscape",
      caption: "Mountain range at sunset",
    },
    {
      src: "/images/gambar.png",
      alt: "Ocean beach",
      caption: "Sandy beach with waves",
    },
    {
      src: "/images/gambar.png",
      alt: "Dense forest",
      caption: "Ancient forest with tall trees",
    },
    {
      src: "/images/gambar.png",
      alt: "Desert landscape",
      caption: "Sand dunes at dawn",
    },
  ];

  // All images combined for the featured gallery
  const allImages = [...newsImages, ...sportsImages, ...natureImages];

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Photo Gallery</h1>
      <div className="rounded-lg border p-2 shadow-md">
        <ImageGallery images={allImages.slice(0, 6)} />
      </div>
    </>
  );
}
