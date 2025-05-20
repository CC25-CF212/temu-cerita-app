"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the Player component with no SSR
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false } // This ensures the component only renders client-side
);

export default function LottieAnimation({ src }: { src: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render Player when component is mounted on client-side
  if (!isMounted) return <div className="w-full h-full bg-blue-50"></div>;

  return <Player autoplay loop src={src} />;
}
