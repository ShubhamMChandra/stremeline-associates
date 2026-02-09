"use client";

import { cn } from "@/lib/utils";

/**
 * What this does: Renders a subtle dot-grid background pattern
 * Why it's here: Adds depth to the contact page and other sections
 * How it works: Uses CSS radial-gradient to render a repeating dot pattern
 * Dependencies: none (pure CSS)
 */
export function DotBackground({
  children,
  className,
  dotColor,
  dotSize = 1,
  gap = 24,
}: {
  children?: React.ReactNode;
  className?: string;
  dotColor?: string;
  dotSize?: number;
  gap?: number;
}) {
  return (
    <div
      className={cn("relative w-full", className)}
      style={{
        backgroundImage: `radial-gradient(${dotColor || "rgba(217, 119, 6, 0.15)"} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${gap}px ${gap}px`,
      }}
    >
      {/* Fade mask at edges */}
      <div className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/** Grid variant with lines instead of dots */
export function GridBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(217, 119, 6, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217, 119, 6, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
