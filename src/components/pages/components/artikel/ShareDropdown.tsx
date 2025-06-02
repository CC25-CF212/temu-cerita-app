"use client";

import { Share2 } from "lucide-react";
import React, { useRef, useEffect } from "react";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

type Props = {
  id: string;
};

export default function ShareDropdown({ id }: Props) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const fullUrl = `${baseUrl}/pages/article/detail/${id}`;

  const [open, setOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Close dropdown when sharing (optional)
  const handleShare = () => {
    setTimeout(() => setOpen(false), 100); // Small delay to allow share action
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        className="mr-4 transition-transform duration-200 hover:scale-110"
      >
        <Share2 size={16} />
      </button>

      {open && (
        <div
          className="absolute z-10 mt-2 bg-white border rounded shadow-lg p-2 flex gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <WhatsappShareButton
            url={fullUrl}
            title="Cek artikel ini!"
            onClick={handleShare}
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>

          <FacebookShareButton url={fullUrl} onClick={handleShare}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <TwitterShareButton
            url={fullUrl}
            title="Artikel bagus!"
            onClick={handleShare}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
      )}
    </div>
  );
}
