"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

export function useScrollAnimation(threshold = 0.1): {
  ref: React.RefObject<HTMLDivElement | null>;
  isInView: boolean;
} {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

export function useMagneticCursor(strength = 0.3): {
  ref: React.RefObject<HTMLDivElement | null>;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
} {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [strength],
  );

  const onMouseLeave = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    element.style.transform = "translate(0px, 0px)";
    element.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
    setTimeout(() => {
      if (element) element.style.transition = "";
    }, 300);
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
