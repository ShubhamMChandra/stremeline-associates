"use client";

import Link from "next/link";
import { Container, Heading, Code } from "@repo/ui";
import { services } from "@repo/content";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { Zap, GitBranch, ShieldCheck, TrendingUp } from "lucide-react";
import { SpotlightCard } from "../aceternity/spotlight";
import { DotBackground } from "../aceternity/dot-background";

/**
 * What this does: Service capabilities in a BentoGrid with LampEffect header and SpotlightCard hover
 * Why it's here: Core service offering — the main thing visitors need to understand
 * How it works: DotBackground texture, gradient line accent on heading, SpotlightCard wrapping
 *   BentoCards for mouse-tracking glow, BorderBeam on lead card
 * Dependencies: @repo/ui, @repo/content, Aceternity (SpotlightCard, DotBackground),
 *   Magic UI (BentoGrid, BorderBeam), lucide-react
 */

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  zap: Zap,
  workflow: GitBranch,
  "shield-check": ShieldCheck,
  "trending-up": TrendingUp,
};

export function Capabilities() {
  return (
    <section id="capabilities" className="relative bg-[#0B0A09] py-12 md:py-16">
      <DotBackground dotColor="rgba(217, 119, 6, 0.08)" dotSize={1} gap={24}>
        <Container>
          {/* Section header — left-aligned, gradient line accent instead of LampEffect */}
          <div className="mb-8">
            <Code className="mb-3 block">// capabilities</Code>
            <Heading size="h2" as="h2">
              What We Automate.
            </Heading>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Every agent targets a specific bottleneck — fewer steps, less overhead, cleaner operations.
            </p>
            <div className="mt-4 h-px w-24 bg-gradient-to-r from-amber-500 to-amber-500/0" />
          </div>
          <BentoGrid className="auto-rows-[18rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <div
                key={service.slug}
                className={`relative ${i === 0 ? "lg:col-span-2 lg:row-span-1" : ""}`}
              >
                <SpotlightCard className="h-full">
                  <BentoCard
                    name={service.title}
                    className={`h-full ${i === 0 ? "col-span-3 lg:col-span-2" : "col-span-3 lg:col-span-1"}`}
                    background={
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent" />
                    }
                    Icon={iconMap[service.icon] || Zap}
                    description={service.description}
                    href={`/services/${service.slug}`}
                    cta="Learn more"
                  />
                </SpotlightCard>
                {i === 0 && (
                  <BorderBeam
                    size={200}
                    duration={12}
                    delay={0}
                    colorFrom="#FBBF24"
                    colorTo="#B45309"
                  />
                )}
              </div>
            ))}
          </BentoGrid>
        </Container>
      </DotBackground>
    </section>
  );
}
