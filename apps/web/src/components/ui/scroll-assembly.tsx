"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@repo/animation";

gsap.registerPlugin(ScrollTrigger);

/**
 * What this does: Grid children scatter into position as user scrolls — cards feel like they assemble
 * Why it's here: Reusable version of the homepage Capabilities scatter-to-grid technique
 * How it works: Each child with [data-assembly-item] gets a random offset/rotation applied,
 *   then GSAP ScrollTrigger with scrub animates everything to its natural grid position.
 *   Falls back to static layout when prefers-reduced-motion is set.
 * Dependencies: gsap, gsap/ScrollTrigger, @repo/animation
 */

interface ScrollAssemblyProps {
  children: ReactNode;
  className?: string;
  /** Attribute name to target children (default: "data-assembly-item") */
  selector?: string;
}

export function ScrollAssembly({
  children,
  className,
  selector = "[data-assembly-item]",
}: ScrollAssemblyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    const trigger = ref.current;
    const items = trigger.querySelectorAll<HTMLElement>(selector);

    items.forEach((item, i) => {
      const xOffset = (i % 2 === 0 ? -1 : 1) * (30 + Math.random() * 25);
      const yOffset = 15 + Math.random() * 15;
      const rotation = (i % 2 === 0 ? -1 : 1) * (1.5 + Math.random() * 2);

      gsap.fromTo(
        item,
        { x: xOffset, y: yOffset, rotation, opacity: 0 },
        {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          scrollTrigger: {
            trigger,
            scrub: true,
            start: "top 90%",
            end: "top 45%",
          },
        },
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === trigger) t.kill();
      });
    };
  }, [reducedMotion, selector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
