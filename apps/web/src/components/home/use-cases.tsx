"use client";

import { Container, Heading, Code } from "@repo/ui";
import { StaggerChildren, staggerItem } from "@repo/animation";
import { useCases } from "@repo/content";
import { motion } from "motion/react";
import { SpotlightCard } from "../aceternity/spotlight";
import { UserPlus, Database, Mail, ArrowLeftRight, Bell } from "lucide-react";

/**
 * What this does: Grid of use cases with SpotlightCard hover effects
 * Why it's here: Helps visitors self-identify — "this is my problem, they solve it"
 * How it works: SpotlightCards add hover interactivity, StaggerChildren animates cards in on scroll
 * Dependencies: @repo/ui, @repo/content, @repo/animation, Aceternity (SpotlightCard), lucide-react
 */

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "user-plus": UserPlus,
  database: Database,
  mail: Mail,
  "arrow-right-left": ArrowLeftRight,
  bell: Bell,
};

export function UseCases() {
  return (
    <section id="use-cases" className="relative py-12 md:py-16">
        <Container>
          {/* Header */}
          <div className="mb-8">
            <Code className="mb-3 block">// use-cases</Code>
            <Heading size="h2" as="h2">
              Common Bottlenecks We Fix.
            </Heading>
            <p className="mt-3 max-w-lg text-muted-foreground">
              The same manual overhead shows up everywhere. These are the patterns we automate most.
            </p>
          </div>

          {/* Cards */}
          {/* 6-col grid: top row 3×2, bottom row 2×3 — both rows fill completely */}
          <StaggerChildren>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {useCases.map((uc, i) => {
                const Icon = iconMap[uc.icon] || Bell;
                // First 3 cards: span 2 of 6 cols. Last 2: span 3 of 6 cols.
                const colClass = i < 3 ? "lg:col-span-2" : "lg:col-span-3";
                return (
                  <motion.div
                    key={uc.slug}
                    variants={staggerItem}
                    className={colClass}
                  >
                    <SpotlightCard className="card-lift h-full p-6">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] text-muted-foreground transition-colors group-hover:bg-amber-500/10 group-hover:text-amber-500">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{uc.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{uc.description}</p>
                    </SpotlightCard>
                  </motion.div>
                );
              })}
            </div>
          </StaggerChildren>
        </Container>
    </section>
  );
}
