"use client";

import Link from "next/link";
import { Container, Heading, Button } from "@repo/ui";
import { WordReveal } from "@repo/animation";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";

/**
 * What this does: Final CTA section merging vision statement with conversion action
 * Why it's here: Emotional closer — paints the vision, then makes the ask
 * How it works: WordReveal headline, NumberTicker stats, BorderBeam CTA card — all centered,
 *   floating in generous dark space with no competing visual noise
 * Dependencies: @repo/ui, @repo/animation (WordReveal), Magic UI (NumberTicker, BorderBeam)
 */

const stats = [
  { value: 40, suffix: "+", label: "Hours of overhead eliminated / week", displayValue: "" },
  { value: 3, suffix: "×", label: "Fewer manual steps per process", displayValue: "" },
  { value: 2, suffix: " wks", label: "Avg. time to deploy", displayValue: "" },
];

export function CTASection() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden py-[clamp(6rem,4rem+8vw,12rem)]"
    >
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

          {/* Vision copy — direct, no hedging */}
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            You don&apos;t need more people. You need less process.
          </p>
          <p className="mt-3 text-base text-muted-foreground/80">
            AI agents absorb the manual overhead across sales, ops, and
            support — so your team focuses on decisions, not data entry.
          </p>

          {/* Stats row */}
          <div className="mt-10 grid grid-cols-1 gap-6 rounded-xl border border-white/[0.06] bg-surface/50 p-6 sm:grid-cols-3 sm:gap-8 sm:p-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-amber-400 sm:text-3xl">
                  {stat.displayValue ? (
                    stat.displayValue
                  ) : (
                    <>
                      <NumberTicker
                        value={stat.value}
                        className="text-amber-400"
                      />
                      <span>{stat.suffix}</span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA card with BorderBeam */}
          <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/[0.06] bg-surface p-6 sm:p-8 lg:p-12">
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
              <Button asChild size="lg">
                <Link href="/contact">Book an Audit</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn About Us</Link>
              </Button>
            </div>
          </div>

          {/* Closing monospace */}
          <p className="mt-8 font-mono text-sm text-amber-500/80">
            From audit to live agents in weeks, not months.
          </p>
        </div>
      </Container>
    </section>
  );
}
