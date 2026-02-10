import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Button } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { processSteps, processTagline } from "@repo/content";
import { ScrollAssembly } from "../../../src/components/ui/scroll-assembly";
import { ScrollTextReveal } from "../../../src/components/ui/scroll-text-reveal";

/**
 * What this does: About page with a narrative arc — thesis, belief, differentiators, process, close
 * Why it's here: Builds credibility and conviction. Tells the story of WHY Stremeline exists.
 * How it works: Five sections that flow into each other: hero thesis → belief manifesto →
 *   concrete differentiators → brief process → scroll-reveal closing.
 *   Each section leads to the next. Not disconnected blocks.
 * Dependencies: @repo/ui, @repo/animation, @repo/content, ScrollAssembly, ScrollTextReveal
 */

export const metadata: Metadata = {
  title: "About",
  description:
    "A lean automation studio built by Ivy League-trained engineers. Enterprise-grade AI agent systems, cost-effective for SMBs.",
};

export default function AboutPage() {
  return (
    <>
      {/* ── 1. Hero — who we are ── */}
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
              A lean automation studio built by operators and engineers.
            </Heading>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Ivy League-trained engineers with Master&apos;s degrees in CS and AI,
              backed by a global network of automation specialists. We build
              enterprise-grade agent systems — priced for growing businesses.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── 2. The Belief — WHY we exist (light, prose not bullets) ── */}
      <section className="light bg-background py-16 md:py-20">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-2xl">
              <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
                // why we started
              </span>
              <Heading size="h2" as="h2" className="mb-8">
                The Gap We Saw
              </Heading>

              <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  Most SMBs are stuck between two bad options. Enterprise automation platforms
                  cost six figures and take months to deploy. DIY tools like basic Zapier
                  workflows break the moment things get complex. So teams keep doing the
                  work manually — and the bottleneck grows as the business does.
                </p>
                <p>
                  We started Stremeline because we believed the engineering talent that builds
                  automation for Fortune 500 companies could be applied to small and mid-size
                  teams — faster, leaner, and at a fraction of the cost. Not by cutting corners,
                  but by cutting overhead.
                </p>
                <p className="font-medium text-foreground">
                  The same AI agent architectures. A studio instead of a consultancy.
                  Your agents live in weeks, not quarters.
                </p>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ── 3. What's Different — concrete differentiators, not abstract values ── */}
      <section className="py-16 md:py-20">
        <Container>
          <FadeIn>
            <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // what makes us different
            </span>
            <Heading size="h2" as="h2" className="mb-10">
              Three Things We Do That Others Don&apos;t
            </Heading>
          </FadeIn>

          <ScrollAssembly className="grid gap-8 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "We build on your existing stack",
                description:
                  "No rip-and-replace. We integrate with the tools your team already uses — your CRM, your project management, your comms. Agents plug into what's already working.",
              },
              {
                number: "02",
                title: "We ship in weeks, not quarters",
                description:
                  "Small team, fast decisions, no committees. Your first agent workflow goes live in under two weeks. We iterate from there based on real results, not slide decks.",
              },
              {
                number: "03",
                title: "We charge like a studio, not a consultancy",
                description:
                  "A global engineering network keeps our costs lean. You get Ivy League talent and enterprise architecture without the enterprise price tag.",
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

      {/* ── 4. How It Works — brief process, subordinate to the story ── */}
      <section className="light bg-background py-16 md:py-20">
        <Container>
          <FadeIn>
            <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // the engagement
            </span>
            <Heading size="h2" as="h2" className="mb-2">
              What Working With Us Looks Like
            </Heading>
            <p className="mb-8 max-w-lg text-sm text-muted-foreground">
              Four steps from first conversation to live agents. Most teams are
              fully operational in under two weeks.
            </p>
          </FadeIn>

          <div>
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="group -mx-4 flex gap-4 rounded-lg border-t border-border px-4 py-5 transition-colors hover:bg-secondary/50 md:items-baseline md:gap-6 md:py-6"
              >
                <span className="shrink-0 font-mono text-sm text-muted-foreground/50 group-hover:text-primary transition-colors">
                  {String(step.number).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 font-mono text-sm text-primary/70">
            {processTagline}
          </p>
        </Container>
      </section>

      {/* ── 5. Closing — scroll-driven serif text reveal + CTA ── */}
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
