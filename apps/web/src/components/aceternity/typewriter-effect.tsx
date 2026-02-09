"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@repo/animation";
import { cn } from "@/lib/utils";

/**
 * What this does: Cycles through words with a typewriter delete/type animation
 * Why it's here: Subheadline that rotates through "leads", "workflows", "operations"
 * How it works: Animates between words in a list with vertical slide transitions
 * Dependencies: motion/react
 */
export function TypewriterEffect({
  words,
  className,
  cursorClassName,
  typingSpeed = 2500,
}: {
  words: string[];
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Still cycle words but slower for reduced-motion users
    const speed = prefersReducedMotion ? typingSpeed * 2 : typingSpeed;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, speed);
    return () => clearInterval(interval);
  }, [words.length, typingSpeed, prefersReducedMotion]);

  // Find the longest word to use as an invisible sizing reference.
  // This prevents layout shift when shorter/longer words swap in.
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), "");

  return (
    <span className={cn("relative inline-flex items-center", className)}>
      {/* Invisible longest word — reserves the width so surrounding text never jumps */}
      <span className="invisible" aria-hidden="true">
        {longestWord}
      </span>

      {/* Visible animated word — absolutely positioned over the reserved space */}
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 inline-block text-amber-500"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>

      {/* Blinking cursor — hidden for reduced motion */}
      {!prefersReducedMotion && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className={cn(
            "ml-1 inline-block h-[1em] w-[2px] bg-amber-500",
            cursorClassName,
          )}
        />
      )}
    </span>
  );
}
