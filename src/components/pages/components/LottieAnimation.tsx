"use client";

import { Player } from "@lottiefiles/react-lottie-player";

export default function LottieAnimation({ src }: { src: string }) {
  return <Player autoplay loop src={src} />;
}
