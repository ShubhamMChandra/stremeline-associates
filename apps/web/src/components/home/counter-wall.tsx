"use client";

import { Container } from "@repo/ui";
import { AnimateOnScroll } from "@repo/animation";

/**
 * What this does: Three brand promises — fast, no lock-in, your tools
 * Why it's here: Addresses the three biggest hesitations a B2B buyer has:
 *   "How long will this take?", "Am I stuck?", "Do I have to change everything?"
 * How it works: Simple grid with bold headlines and one-line explanations.
 *   Serif italic closer ties it together. No fake metrics — just honest commitments.
 * Dependencies: @repo/ui, @repo/animation
 */

const values = [
  {
    headline: "Live in weeks",
    subline: "Most engagements deploy in under two weeks — not months of scoping and planning.",
  },
  {
    headline: "Zero lock-in",
    subline: "Month-to-month. Your agents earn their place — or we haven't built them right.",
  },
  {
    headline: "Your tools, not ours",
    subline: "We build inside your existing stack. No new platforms to learn, nothing gets replaced.",
  },
];

export function CounterWall() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        {/* Value propositions */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {values.map((v, i) => (
            <AnimateOnScroll key={i}>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {v.headline}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {v.subline}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Brand voice closer */}
        <AnimateOnScroll>
          <p
            className="mx-auto mt-16 max-w-2xl text-center text-2xl leading-relaxed italic text-foreground/80 md:mt-20 md:text-3xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            We build agents that handle the work your team shouldn&apos;t be doing.
            Nothing more, nothing less.
          </p>
        </AnimateOnScroll>
      </Container>
    </section>
  );
}
