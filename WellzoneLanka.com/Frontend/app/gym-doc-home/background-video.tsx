"use client";

import { useEffect, useRef } from "react";

interface BackgroundVideoProps {
  videoSrc: string;
}

export function BackgroundVideo({ videoSrc }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing the video:", error);
      });
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-[-1]">
      <div className="absolute inset-0 bg-black/40 z-[1]"></div>
      <video
        ref={videoRef}
        className="absolute min-w-full min-h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
