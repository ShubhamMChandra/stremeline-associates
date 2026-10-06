import type { Metadata } from "next";
import Link from "next/link";
import { Container, Button } from "@repo/ui";
import { FadeIn } from "@repo/animation";
/**
 * What this does: About page with a narrative arc told in a direct, human voice
 * Why it's here: Builds conviction. Explains why WAM exists and why you'd work with them
 * How it works: Four sections on one paper ground that read as one story: who we are,
 *   what we noticed, what you get (hairline list), and a plain closing line with a CTA.
 * Dependencies: @repo/ui, @repo/animation
 */

export const metadata: Metadata = {
  title: "About",
  description:
    "WAM is a small studio of engineers that builds AI agent workflows for growing businesses. Fast deployment, no lock-in, real results.",
};

const principles = [
  {
    title: "We work inside your tools",
    description:
      "No new platforms to learn. We build agents that plug into the CRM, project management, and communication tools your team already uses. Nothing gets replaced.",
  },
  {
    title: "We move fast",
    description:
      "We audit your workflows, design the agents, and deploy them, usually in under two weeks. Then we iterate based on what's actually happening in your operations.",
  },
  {
    title: "We keep it lean",
    description:
      "Small team, low overhead. You're paying for the engineering work that ships, without an expensive office or a bench of junior consultants.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── 1. Hero ── */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-16">
        <Container>
          <FadeIn>
            <h1 className="max-w-4xl text-[clamp(2.5rem,1.5rem+4vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-foreground">
              We build AI agents for teams that are growing faster than they can
              hire.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              WAM is a small studio of entrepreneurs, engineers, and operators.
              We design agent workflows that handle the repetitive work your team
              shouldn&apos;t be doing, and we get them live fast.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── 2. What we kept seeing ── */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
                What we kept seeing
              </h2>

              <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  Growing companies with great products, where smart people
                  spent half their day on tasks a well-designed agent could
                  handle in seconds. Manually sorting leads. Copy-pasting between
                  tools. Chasing follow-ups that slip through the cracks.
                </p>
                <p>
                  The tools available either cost a fortune and take months to
                  set up, or they&apos;re too fragile for anything beyond a
                  simple trigger. So teams just keep doing it by hand, and the
                  bottleneck gets worse the faster the business grows.
                </p>
                <p className="font-medium text-foreground">
                  So we set out to build automation that actually works: scoped
                  to what you need, plugged into the tools you already use, and
                  live quickly.
                </p>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ── 3. What you get ── */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
              What you get
            </h2>
          </FadeIn>

          <ul className="mt-10 grid gap-x-8 md:grid-cols-3">
            {principles.map((item) => (
              <li key={item.title} className="border-t border-border py-6">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── 4. Closing ── */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn>
            <p className="max-w-2xl text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              A small team, the tools you already use, and automation that
              works.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/contact">Start a conversation</Link>
            </Button>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
