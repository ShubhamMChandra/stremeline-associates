"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { useReducedMotion } from "@repo/animation";
import { cn } from "@/lib/utils";

/**
 * What this does: Reveals text word-by-word with a blur-to-sharp animation
 * Why it's here: Premium headline reveal for the hero section
 * How it works: Splits text into words, animates each with staggered opacity + blur
 * Dependencies: motion/react
 */
export function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true });
  const prefersReducedMotion = useReducedMotion();
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (isInView) {
      // Skip animation for users who prefer reduced motion
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        prefersReducedMotion
          ? { duration: 0 }
          : { duration, delay: stagger(0.06) },
      );
    }
  }, [isInView, animate, duration, filter, prefersReducedMotion]);

  return (
    <div className={cn("font-bold", className)}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="inline-block opacity-0"
            style={{
              filter: filter ? "blur(4px)" : "none",
            }}
          >
            {word}
            {idx < wordsArray.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
