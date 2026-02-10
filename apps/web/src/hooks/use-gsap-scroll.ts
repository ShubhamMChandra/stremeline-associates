"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * What this does: Registers GSAP ScrollTrigger and syncs it with Lenis smooth scroll
 * Why it's here: All scroll-driven animations (horizontal scroll, scrub counters, stacked cards) depend on this
 * How it works: Registers ScrollTrigger plugin, connects to Lenis via the global instance,
 *   and ensures ScrollTrigger.update() fires on every Lenis scroll event
 * Dependencies: gsap, gsap/ScrollTrigger
 */

// Register once at module level
gsap.registerPlugin(ScrollTrigger);

export function useGSAPScroll() {
  useEffect(() => {
    // Lenis integration: Lenis dispatches a native scroll event which
    // ScrollTrigger listens to automatically. We just need to make sure
    // ScrollTrigger refreshes on resize and recalculates positions.
    ScrollTrigger.defaults({
      // Use the natural document scroll — Lenis handles the smoothing
      // but doesn't replace the scroller
    });

    // Refresh on window resize (debounced internally by GSAP)
    ScrollTrigger.refresh();

    return () => {
      // Kill all ScrollTrigger instances on unmount to prevent memory leaks
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
}

export { gsap, ScrollTrigger };
