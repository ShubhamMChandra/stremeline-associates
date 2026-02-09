"use client";

import { Container, Heading, Code } from "@repo/ui";
import { StaggerChildren, staggerItem } from "@repo/animation";
import { useCases } from "@repo/content";
import { motion } from "motion/react";
import { SpotlightCard } from "../aceternity/spotlight";
import { GridBackground } from "../aceternity/dot-background";
import { UserPlus, Database, Mail, ArrowLeftRight, Bell } from "lucide-react";

/**
 * What this does: Grid of use cases with SpotlightCard hover effects and GridBackground texture
 * Why it's here: Helps visitors self-identify — "this is my problem, they solve it"
 * How it works: GridBackground provides subtle line texture, SpotlightCards add hover interactivity,
 *   StaggerChildren animates cards in on scroll
 * Dependencies: @repo/ui, @repo/content, @repo/animation, Aceternity (SpotlightCard, GridBackground), lucide-react
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
    <section id="use-cases" className="relative pb-[clamp(4rem,3rem+5vw,8rem)] pt-[clamp(2.5rem,2rem+3vw,5rem)]">
      <GridBackground>
        <Container>
          {/* Header */}
          <div className="mb-12">
            <Code className="mb-3 block">// use-cases</Code>
            <Heading size="h2" as="h2">
              Common Bottlenecks We <span className="text-gradient">Fix.</span>
            </Heading>
            <p className="mt-3 max-w-lg text-muted-foreground">
              The same manual overhead shows up everywhere. These are the patterns we automate most.
            </p>
            <div className="mt-6 h-px w-24 bg-gradient-to-r from-amber-500 to-amber-500/0" />
          </div>

          {/* Cards */}
          <StaggerChildren>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((uc, i) => {
                const Icon = iconMap[uc.icon] || Bell;
                return (
                  <motion.div
                    key={uc.slug}
                    variants={staggerItem}
                    className={i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}
                    style={{ marginTop: i % 2 !== 0 ? "1.5rem" : "0" }}
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
      </GridBackground>
    </section>
  );
}
