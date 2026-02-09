"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useTransform, useAnimationFrame } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * What this does: Creates a card with an animated gradient border that orbits around it
 * Why it's here: Premium card treatment for team members and featured content
 * How it works: Animates a gradient along the card border using SVG path animation
 * Dependencies: motion/react
 */
export function MovingBorder({
  children,
  className,
  containerClassName,
  borderRadius = "1rem",
  duration = 4000,
  borderColor,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  duration?: number;
  borderColor?: string;
}) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMs = length / duration;
      progress.set((time * pxPerMs) % length);
    }
  });

  const x = useTransform(progress, (val) => {
    return pathRef.current?.getPointAtLength(val)?.x ?? 0;
  });

  const y = useTransform(progress, (val) => {
    return pathRef.current?.getPointAtLength(val)?.y ?? 0;
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <div
      className={cn(
        "relative overflow-hidden p-[1px]",
        containerClassName,
      )}
      style={{ borderRadius }}
    >
      <div className="absolute inset-0" style={{ borderRadius }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute h-full w-full"
          width="100%"
          height="100%"
        >
          <rect
            fill="none"
            width="100%"
            height="100%"
            rx={borderRadius}
            ry={borderRadius}
            ref={pathRef}
          />
        </svg>
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "inline-block",
            transform,
          }}
        >
          <div
            className={cn(
              "h-20 w-20 rounded-full opacity-[0.8]",
              "bg-[radial-gradient(var(--amber-500)_40%,transparent_60%)]",
            )}
            style={{
              background: `radial-gradient(${borderColor || "#D97706"} 40%, transparent 60%)`,
            }}
          />
        </motion.div>
      </div>
      <div
        className={cn(
          "relative z-10 border border-white/[0.06] bg-background backdrop-blur-xl",
          className,
        )}
        style={{ borderRadius }}
      >
        {children}
      </div>
    </div>
  );
}
