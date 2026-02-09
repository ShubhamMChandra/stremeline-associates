"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * What this does: Wraps the app with Lenis smooth scrolling
 * Why it's here: Creates the premium "butter" scroll feel across the entire site
 * How it works: Initializes Lenis on mount, runs a rAF loop, and cleans up on unmount.
 *   Also integrates with GSAP ScrollTrigger if available.
 * Dependencies: lenis
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion — disable smooth scrolling
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Integrate with GSAP ScrollTrigger if loaded
    // ScrollTrigger.scrollerProxy is set up in the GSAP hook
    lenis.on("scroll", () => {
      // This ensures GSAP ScrollTrigger stays in sync with Lenis
      if (typeof window !== "undefined" && (window as any).__gsapScrollTrigger) {
        (window as any).__gsapScrollTrigger.update();
      }
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
