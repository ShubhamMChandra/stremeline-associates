"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";

/**
 * What this does: A 2px amber hairline at the top of the viewport showing scroll progress
 * Why it's here: Subtle design-studio signal — shows the visitor how far they've scrolled
 * How it works: Listens to scroll events, calculates progress as a percentage, renders
 *   a fixed-position bar with spring-smoothed width
 * Dependencies: motion/react
 */
export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(scrollTop / docHeight);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const springProgress = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Update the spring target when scroll changes
  useEffect(() => {
    springProgress.set(scrollProgress);
  }, [scrollProgress, springProgress]);

  const width = useTransform(springProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[60] h-[2px] bg-primary"
      style={{ width }}
      aria-hidden="true"
    />
  );
}
