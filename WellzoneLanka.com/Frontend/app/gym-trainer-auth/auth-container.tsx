import type React from "react";
import Image from "next/image";

interface AuthContainerProps {
  children: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}

export function AuthContainer({
  children,
  imageSrc = "/placeholder.svg?height=800&width=600",
  imageAlt = "Wellzone Lanka",
}: AuthContainerProps) {
  return (
    <div className="flex min-h-screen overflow-hidden bg-muted/30">
      {/* Left side - Image container with centered content */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-8">
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary/10 z-10 rounded-2xl" />
          <Image
            src={imageSrc || "/images/trainer.jpg"}
            alt={imageAlt}
            fill
            className="object-cover rounded-2xl"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
              Wellzone Lanka
            </h2>
            <p className="text-white/90 mt-2 max-w-md drop-shadow-md text-sm md:text-base">
              Your complete health and fitness platform connecting patients,
              doctors, and trainers.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
