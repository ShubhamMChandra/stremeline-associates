"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

/**
 * What this does: Wraps the app with Lenis smooth scrolling + GSAP ScrollTrigger integration
 * Why it's here: Creates the premium "butter" scroll feel and powers all scroll-driven animations
 * How it works: Initializes Lenis, registers ScrollTrigger, syncs them via lenis.on("scroll"),
 *   and runs a rAF loop for both systems
 * Dependencies: lenis, gsap, gsap/ScrollTrigger
 */

// Register GSAP plugin at module level (safe to call multiple times)
gsap.registerPlugin(ScrollTrigger);

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

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP ticker for the Lenis rAF loop — keeps both systems in perfect sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
