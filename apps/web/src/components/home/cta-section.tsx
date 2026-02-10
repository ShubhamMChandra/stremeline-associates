"use client";

import Link from "next/link";
import { Container, Heading, Button } from "@repo/ui";
import { WordReveal } from "@repo/animation";
import { BorderBeam } from "@/components/ui/border-beam";

/**
 * What this does: Final CTA section merging vision statement with conversion action
 * Why it's here: Emotional closer — paints the vision, then makes the ask
 * How it works: WordReveal headline, BorderBeam CTA card — all centered,
 *   floating in generous dark space with no competing visual noise
 * Dependencies: @repo/ui, @repo/animation (WordReveal), Magic UI (BorderBeam)
 */

export function CTASection() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden py-12 md:py-16"
    >
      {/* Faint cool tint — contrasts the warm sections above */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#0A0B0D]/60" />
      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          {/* Monospace label */}
          <span className="font-mono text-xs tracking-widest text-amber-500/80 uppercase">
            // next-step
          </span>

          {/* WordReveal headline */}
          <div className="mt-6">
            <Heading size="h2" as="h2">
              <WordReveal text="Simpler Operations. Starting Now." />
            </Heading>
          </div>

          {/* Vision line — one sentence, then the ask */}
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            You don&apos;t need more people. You need less process.
          </p>

          {/* CTA card with BorderBeam */}
          <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/[0.06] bg-surface p-6 sm:p-8 lg:p-10">
            <BorderBeam
              size={300}
              duration={10}
              delay={0}
              colorFrom="#FBBF24"
              colorTo="#B45309"
            />

            <Heading size="h3" as="h3">
              Start your audit today.
            </Heading>
            <p className="mt-3 text-muted-foreground">
              We&apos;ll map your workflows, find the manual overhead, and
              show you exactly where agents simplify things. Most teams are
              live in under two weeks.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="btn-glow">
                <Link href="/contact">Book an Audit</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
