import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

export const Marquee = ({
  children,
  reverse,
  pauseOnHover = false,
  className,
  vertical = false,
}: {
  children?: React.ReactNode;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  vertical?: boolean;
}) => {
  const [duration, setDuration] = useState("40s");
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (marqueeRef.current) {
      const contentWidth = vertical
        ? marqueeRef.current.scrollHeight
        : marqueeRef.current.scrollWidth;
      const containerWidth = vertical
        ? marqueeRef.current.clientHeight
        : marqueeRef.current.clientWidth;
      const durationValue = Math.max(contentWidth / containerWidth) * 20;
      setDuration(`${durationValue}s`);
    }
  }, [vertical]);

  return (
    <div
      className={cn(
        "group flex overflow-hidden",
        vertical ? "flex-col" : "flex-row",
        className
      )}
    >
      <div
        ref={marqueeRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4",
          vertical ? "flex-col" : "flex-row",
          "animate-[marquee_var(--duration,40s)_linear_infinite]",
          reverse && "direction-reverse",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{ "--duration": duration } as React.CSSProperties}
      >
        {children}
        {children}
      </div>
    </div>
  );
};