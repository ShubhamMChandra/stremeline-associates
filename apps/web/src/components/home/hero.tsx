"use client";

import Link from "next/link";
import { motion, useAnimate } from "motion/react";
import { useEffect } from "react";
import { Button, Container } from "@repo/ui";
import { LiveTerminal } from "./live-terminal";
import { useReducedMotion } from "@repo/animation";

/**
 * What this does: Hero section with clip-path headline reveal and a living terminal demo
 * Why it's here: First impression — must feel authored, alive, and conversion-focused
 * How it works: Orchestrated entrance sequence (headline clips in, terminal types, stats fade up).
 *   No library components — just Motion, custom terminal, and clean typography.
 * Dependencies: motion/react, @repo/ui, @repo/animation, LiveTerminal
 */

export function Hero() {
  const reducedMotion = useReducedMotion();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (reducedMotion) return;

    // Orchestrated entrance: headline -> terminal -> subtitle -> buttons -> stats
    const sequence = async () => {
      // Headline clips in from left (0.3s - 0.9s)
      await animate(
        "[data-hero-headline]",
        { clipPath: "inset(0 0% 0 0)" },
        { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
      );
      // Subtitle + buttons fade up
      animate(
        "[data-hero-subtitle]",
        { opacity: 1, y: 0 },
        { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      );
      animate(
        "[data-hero-buttons]",
        { opacity: 1, y: 0 },
        { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
      );
      // Stats last
      animate(
        "[data-hero-stats]",
        { opacity: 1, y: 0 },
        { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
      );
    };

    sequence();
  }, [animate, reducedMotion]);

  return (
    <section
      ref={scope}
      id="hero"
      className="relative flex items-center overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16"
    >
      {/* Gradient blobs — ambient drift, custom (not from any library) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-1/4 -top-1/4 h-[300px] w-[300px] animate-[drift_20s_ease-in-out_infinite] rounded-full bg-amber-500/15 blur-[120px] lg:h-[600px] lg:w-[600px]" />
        <div className="absolute -right-1/4 top-1/4 h-[250px] w-[250px] animate-[drift_25s_ease-in-out_infinite_reverse] rounded-full bg-sky-500/[0.08] blur-[100px] lg:h-[500px] lg:w-[500px]" />
        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />
      </div>

      {/* Content */}
      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Left: Content */}
          <div className="max-w-2xl">
            {/* Monospace label — only used once on the entire site */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4"
            >
              <span className="font-mono text-xs tracking-widest text-primary/80 uppercase">
                // stremeline-associates
              </span>
            </motion.div>

            {/* Headline — clip-path curtain wipe, no TextGenerateEffect */}
            <h1
              data-hero-headline
              className="text-[clamp(2.5rem,1.5rem+5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.04em]"
              style={{
                clipPath: reducedMotion ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              }}
            >
              Your ops team
              <br />
              just got an upgrade.
            </h1>

            {/* Subtitle — static, confident, no TypewriterEffect */}
            <p
              data-hero-subtitle
              className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground"
              style={reducedMotion ? {} : { opacity: 0, transform: "translateY(8px)" }}
            >
              AI agents that handle the repetitive work your team shouldn&apos;t be doing.
            </p>

            {/* CTA buttons */}
            <div
              data-hero-buttons
              className="mt-8 flex flex-wrap gap-4"
              style={reducedMotion ? {} : { opacity: 0, transform: "translateY(8px)" }}
            >
              <Button asChild size="lg" className="btn-glow">
                <Link href="/contact">Book an Audit</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/case-studies">See Our Work</Link>
              </Button>
            </div>

            {/* Social proof stat bar */}
            <div
              data-hero-stats
              className="mt-8 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:gap-8"
              style={reducedMotion ? {} : { opacity: 0, transform: "translateY(8px)" }}
            >
              {[
                { value: "< 2 wks", label: "to go live" },
                { value: "0", label: "lock-in contracts" },
                { value: "15+", label: "platforms connected" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <span className="font-mono text-sm font-semibold text-primary">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Living Terminal */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <LiveTerminal />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
