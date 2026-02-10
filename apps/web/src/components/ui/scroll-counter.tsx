"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@repo/animation";

gsap.registerPlugin(ScrollTrigger);

/**
 * What this does: Number that counts up (or down) as the user scrolls, tied to scroll position
 * Why it's here: Reusable version of the homepage CounterWall technique for stat bands and results
 * How it works: GSAP ScrollTrigger with scrub animates a proxy value. React state updates the display.
 *   Falls back to final value when prefers-reduced-motion is set.
 * Dependencies: gsap, gsap/ScrollTrigger, @repo/animation
 */

interface ScrollCounterProps {
  from: number;
  to: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  /** Format function for the displayed number (default: Math.round) */
  format?: (value: number) => string;
}

export function ScrollCounter({
  from,
  to,
  suffix = "",
  prefix = "",
  className,
  format,
}: ScrollCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (reducedMotion || !ref.current) {
      setValue(to);
      return;
    }

    const tween = gsap.to(
      { val: from },
      {
        val: to,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          scrub: true,
          start: "top 75%",
          end: "top 35%",
        },
        onUpdate: function () {
          setValue(Math.round(this.targets()[0].val));
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
    };
  }, [reducedMotion, from, to]);

  const displayValue = format ? format(value) : String(value);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
