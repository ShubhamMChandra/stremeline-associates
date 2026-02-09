"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * What this does: Creates a dramatic "lamp" lighting reveal for section headers
 * Why it's here: Visually striking section opener for "How It Works"
 * How it works: Animates a gradient cone that expands from a point, revealing content
 * Dependencies: motion/react
 */
export function LampEffect({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-md",
        className,
      )}
    >
      {/* Lamp container */}
      <div className="relative isolate z-0 flex w-full flex-1 items-center justify-center">
        {/* Left cone */}
        <motion.div
          initial={{ opacity: 0.5, width: "8rem" }}
          whileInView={{ opacity: 1, width: "20rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
          }}
          className="bg-gradient-conic absolute inset-auto right-1/2 h-48 w-[20rem] overflow-visible from-amber-500 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-background [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-full w-10 bg-background" />
        </motion.div>

        {/* Right cone */}
        <motion.div
          initial={{ opacity: 0.5, width: "8rem" }}
          whileInView={{ opacity: 1, width: "20rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
          }}
          className="bg-gradient-conic absolute inset-auto left-1/2 h-48 w-[20rem] from-transparent via-transparent to-amber-500 [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute bottom-0 right-0 z-20 h-full w-10 bg-background" />
          <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-background [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Top line glow */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 bg-background" />
        <motion.div
          initial={{ width: "6rem" }}
          whileInView={{ width: "16rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-[16rem] -translate-y-[5.5rem] bg-amber-500"
        />
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "20rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-amber-500/20 blur-2xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-50 -mt-40 flex flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
}
