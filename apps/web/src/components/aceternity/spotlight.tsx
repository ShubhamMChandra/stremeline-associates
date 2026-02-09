"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * What this does: Creates a spotlight that follows the mouse cursor
 * Why it's here: Adds depth and interactivity to about/team sections
 * How it works: Tracks mouse position via onMouseMove and renders a radial gradient
 * Dependencies: motion/react
 */
export function Spotlight({
  className,
  fill,
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className={cn(
        "pointer-events-none absolute -top-40 left-0 z-[1] h-[200%] w-[200%] opacity-0 md:opacity-100",
        className,
      )}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 836"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#spotlight-filter)">
          <ellipse
            cx="316"
            cy="218"
            rx="316"
            ry="218"
            transform="matrix(-1 0 0 1 780 -70)"
            fill={fill || "rgba(217, 119, 6, 0.08)"}
          />
        </g>
        <defs>
          <filter
            id="spotlight-filter"
            x="0"
            y="-240"
            width="1440"
            height="1076"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="150" result="blur" />
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
}

/** Interactive card with spotlight hover effect */
export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div
      ref={divRef}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/[0.06] bg-surface",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(217, 119, 6, 0.06), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}
