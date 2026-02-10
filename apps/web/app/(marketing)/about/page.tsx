import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Button } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { ScrollAssembly } from "../../../src/components/ui/scroll-assembly";
import { ScrollTextReveal } from "../../../src/components/ui/scroll-text-reveal";

/**
 * What this does: About page with a narrative arc told in a direct, human voice
 * Why it's here: Builds conviction — explains why Stremeline exists and why you'd work with them
 * How it works: Four sections that read as one story: who we are → what we noticed →
 *   how we're different → closing. No generic process steps. No credential flexing.
 *   The copy sounds like a founder explaining the company to a friend.
 * Dependencies: @repo/ui, @repo/animation, ScrollAssembly, ScrollTextReveal
 */

export const metadata: Metadata = {
  title: "About",
  description:
    "Stremeline is a small studio of engineers that builds AI agent workflows for growing businesses. Fast deployment, no lock-in, real results.",
};

export default function AboutPage() {
  return (
    <>
      {/* ── 1. Hero — who we are, said simply ── */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -left-1/4 -top-1/4 h-[250px] w-[250px] animate-[drift_20s_ease-in-out_infinite] rounded-full bg-amber-500/10 blur-[100px] lg:h-[500px] lg:w-[500px]" />
          <div className="absolute -right-1/4 top-1/3 h-[200px] w-[200px] animate-[drift_25s_ease-in-out_infinite_reverse] rounded-full bg-sky-500/[0.05] blur-[80px] lg:h-[400px] lg:w-[400px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "256px 256px",
            }}
          />
        </div>

        <Container className="relative z-10">
          <FadeIn>
            <span className="mb-4 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // about
            </span>
            <Heading size="h1" as="h1" className="max-w-3xl">
              We build AI agents for teams that are growing faster than they can hire.
            </Heading>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Stremeline is a small studio of engineers and operators. We design
              agent workflows that handle the repetitive work your team
              shouldn&apos;t be doing — and we get them live fast.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── 2. What we noticed — the insight, told like a human ── */}
      <section className="light bg-background py-16 md:py-20">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-2xl">
              <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
                // why this exists
              </span>
              <Heading size="h2" as="h2" className="mb-8">
                What We Kept Seeing
              </Heading>

              <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  Growing companies with great products, where smart people spent
                  half their day on tasks a well-designed agent could handle in
                  seconds. Manually sorting leads. Copy-pasting between tools.
                  Chasing follow-ups that slip through the cracks.
                </p>
                <p>
                  The tools available either cost a fortune and take months to
                  set up, or they&apos;re too fragile for anything beyond a simple
                  trigger. So teams just keep doing it by hand — and the
                  bottleneck gets worse the faster the business grows.
                </p>
                <p className="font-medium text-foreground">
                  We thought: what if we could build the kind of automation that
                  actually works — scoped to what you need, plugged into the
                  tools you already use, and live before you&apos;ve forgotten about it?
                </p>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ── 3. How we're different — specific, not generic ── */}
      <section className="py-16 md:py-20">
        <Container>
          <FadeIn>
            <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // how we work
            </span>
            <Heading size="h2" as="h2" className="mb-10">
              What You Get
            </Heading>
          </FadeIn>

          <ScrollAssembly className="grid gap-8 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "We work inside your tools",
                description:
                  "No new platforms to learn. We build agents that plug into your CRM, your project management, your comms — the systems your team already knows. Nothing gets replaced.",
              },
              {
                number: "02",
                title: "We move fast",
                description:
                  "We audit your workflows, design the agents, and deploy them — usually in under two weeks. Then we iterate based on what's actually happening, not what a slide deck predicted.",
              },
              {
                number: "03",
                title: "We keep it lean",
                description:
                  "Small team, low overhead. You're not paying for an office in Manhattan or a bench of junior consultants. You're paying for the engineering work that actually ships.",
              },
            ].map((item) => (
              <div key={item.number} data-assembly-item className="group">
                <span className="font-mono text-sm text-muted-foreground/40">
                  {item.number}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </ScrollAssembly>
        </Container>
      </section>

      {/* ── 4. Closing — scroll-driven serif text reveal + CTA ── */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <ScrollTextReveal start={85} end={55}>
              <p
                className="text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.2] text-foreground/90"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                No bloated teams. No unnecessary platforms. Just automation that works.
              </p>
            </ScrollTextReveal>
            <FadeIn delay={0.3}>
              <Button asChild size="lg" className="btn-glow mt-10">
                <Link href="/contact">Start a Conversation</Link>
              </Button>
            </FadeIn>
          </div>
        </Container>
      </section>
    </>
  );
}
