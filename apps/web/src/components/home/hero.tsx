"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button, Container } from "@repo/ui";
import { BackgroundBeams } from "../aceternity/background-beams";
import { TextGenerateEffect } from "../aceternity/text-generate-effect";
import { TypewriterEffect } from "../aceternity/typewriter-effect";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { Search, PenTool, Rocket, BarChart3, Zap } from "lucide-react";

/**
 * What this does: Full-viewport hero with animated beams, text reveal, OrbitingCircles, and social proof
 * Why it's here: First impression — must feel premium, alive, and conversion-focused
 * How it works: Combines BackgroundBeams, TextGenerateEffect headline, TypewriterEffect cycling,
 *   OrbitingCircles visualization (replaces heavy 3D), parallax gradient blobs, and social proof stat bar
 * Dependencies: motion/react, @repo/ui, Aceternity components, Magic UI OrbitingCircles, lucide-react
 */

const rotatingWords = [
  "lead routing",
  "CRM hygiene",
  "pipeline reports",
  "client handoffs",
  "data entry",
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex items-center overflow-hidden pt-8 md:pt-12"
    >
      {/* Animated background beams */}
      <BackgroundBeams className="z-0" />

      {/* Gradient blobs — ambient drift, no scroll-linking (avoids Lenis/Framer conflict) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute -left-1/4 -top-1/4 h-[300px] w-[300px] animate-[drift_20s_ease-in-out_infinite] rounded-full bg-amber-500/15 blur-[120px] lg:h-[600px] lg:w-[600px]" />
        <div className="absolute -right-1/4 top-1/4 h-[250px] w-[250px] animate-[drift_25s_ease-in-out_infinite_reverse] rounded-full bg-sky-500/[0.08] blur-[100px] lg:h-[500px] lg:w-[500px]" />
      </div>

      {/* Content */}
      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Left: Content */}
          <div className="max-w-2xl">
            {/* Monospace label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4"
            >
              <span className="font-mono text-xs tracking-widest text-amber-500/80 uppercase">
                // stremeline-associates
              </span>
            </motion.div>

            {/* Headline with text generate effect */}
            <h1 className="text-[clamp(2.5rem,1.5rem+5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em]">
              <TextGenerateEffect
                words="Your operations, minus the busywork."
                className="block"
                duration={0.4}
              />
            </h1>

            {/* Subheadline with typewriter cycling */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground"
            >
              Too many steps, too many tools, too much overhead.{" "}
              <TypewriterEffect words={rotatingWords} typingSpeed={2500} />
              {" "}should be automated — we build the agents that make it so.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button asChild size="lg" className="btn-glow">
                <Link href="/contact">Book an Audit</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/case-studies">See Our Work</Link>
              </Button>
            </motion.div>

            {/* Social proof stat bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:gap-8"
            >
              {[
                { value: "< 2 wks", label: "to go live" },
                { value: "0", label: "lock-in contracts" },
                { value: "Your tools", label: "we just connect them" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <span className="font-mono text-sm font-semibold text-amber-400">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: OrbitingCircles visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="relative h-[250px] w-[250px] lg:h-[400px] lg:w-[400px]">
              {/* Center node */}
              <div className="absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-500/30 bg-surface text-amber-500 lg:h-16 lg:w-16">
                <Zap className="h-5 w-5 lg:h-7 lg:w-7" />
              </div>

              {/* Inner orbit — process icons */}
              <OrbitingCircles radius={70} duration={30} speed={1} iconSize={36} path>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/20 bg-surface text-amber-500">
                  <Search className="h-4 w-4" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/20 bg-surface text-amber-500">
                  <PenTool className="h-4 w-4" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/20 bg-surface text-amber-500">
                  <Rocket className="h-4 w-4" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/20 bg-surface text-amber-500">
                  <BarChart3 className="h-4 w-4" />
                </div>
              </OrbitingCircles>

              {/* Faint outer ring — gives depth without noise */}
              <OrbitingCircles radius={115} duration={40} speed={1} reverse iconSize={0} path />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
