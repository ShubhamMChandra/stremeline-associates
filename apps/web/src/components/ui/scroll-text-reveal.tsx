"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@repo/animation";

gsap.registerPlugin(ScrollTrigger);

/**
 * What this does: Clip-path text reveal tied to scroll position — text wipes in from left as user scrolls
 * Why it's here: Reusable version of the homepage CTA's serif reveal effect for inner pages
 * How it works: GSAP ScrollTrigger with scrub animates clipPath from hidden to visible.
 *   Falls back to visible text when prefers-reduced-motion is set.
 * Dependencies: gsap, gsap/ScrollTrigger, @repo/animation
 */

interface ScrollTextRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Viewport percentage where animation starts (default: 80) */
  start?: number;
  /** Viewport percentage where animation ends (default: 50) */
  end?: number;
}

export function ScrollTextReveal({
  children,
  className,
  start = 80,
  end = 50,
}: ScrollTextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    const el = ref.current;
    const tween = gsap.fromTo(
      el,
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          scrub: true,
          start: `top ${start}%`,
          end: `top ${end}%`,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
    };
  }, [reducedMotion, start, end]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        clipPath: reducedMotion ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
      }}
    >
      {children}
    </div>
  );
}
