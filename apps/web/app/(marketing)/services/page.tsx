import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Button } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { services, processSteps, processTagline } from "@repo/content";
import { Zap, Workflow, ShieldCheck, TrendingUp } from "lucide-react";
import { ScrollTextReveal } from "../../../src/components/ui/scroll-text-reveal";

/**
 * What this does: Services page — four capabilities, process steps, values, and CTA
 * Why it's here: Dedicated page to explain what Stremeline builds and how they work
 * How it works: Server component with five visually distinct sections. Each uses a different format:
 *   atmospheric hero → full-width feature rows → 4-column process grid → large scroll counters
 *   → serif CTA. Light/dark alternation with gradient transitions for visual rhythm.
 * Dependencies: @repo/ui, @repo/content, @repo/animation, lucide-react, ScrollCounter, ScrollTextReveal
 */

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  workflow: Workflow,
  "shield-check": ShieldCheck,
  "trending-up": TrendingUp,
};

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI agent capabilities: lead capture, workflow automation, error reduction, and scaling operations — without adding headcount.",
};

export default function ServicesPage() {
  return (
    <>
      {/* ── 1. Hero (dark) — atmospheric opening with serif accent ── */}
      <section className="relative overflow-hidden pt-20 pb-14 md:pt-28 md:pb-20">
        {/* Background atmosphere */}
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
              // services
            </span>
            <Heading size="h1" as="h1" className="max-w-3xl">
              What We Build
            </Heading>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              AI agent systems that handle the work your team shouldn&apos;t be
              doing manually. We design, build, and deploy — fast.
            </p>
            <p
              className="mt-8 max-w-xl text-xl leading-relaxed text-foreground/80 md:text-2xl"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            >
              Your team does the work that matters. Agents handle everything
              else.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── Transition: dark → light ── */}
      <div
        className="h-8 md:h-12"
        style={{ background: "linear-gradient(to bottom, #0A0A0B, #FAFAF9)" }}
        aria-hidden="true"
      />

      {/* ── 2. Services deep-dive (light) — each service gets a full row ── */}
      <section className="light bg-background py-16 md:py-20">
        <Container>
          <FadeIn>
            <Heading size="h2" as="h2" className="mb-4">
              Core Capabilities
            </Heading>
            <p className="mb-8 max-w-lg text-lg text-muted-foreground md:mb-10">
              Four automation pillars. Each one removes a specific category of
              manual work from your operations.
            </p>
          </FadeIn>

          <div className="flex flex-col">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon];
              return (
                <FadeIn key={service.slug}>
                  <div className="group grid gap-4 border-t border-border py-6 md:grid-cols-[100px_1fr] md:gap-8 md:py-8">
                    {/* Left: index + icon */}
                    <div className="flex items-start gap-4 md:flex-col md:items-start md:gap-3">
                      <span className="text-[clamp(2rem,4vw,3.5rem)] font-extralight leading-none tracking-tight text-muted-foreground/20">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {Icon && (
                        <Icon
                          className="mt-1 size-5 text-primary md:mt-0"
                          strokeWidth={1.75}
                        />
                      )}
                    </div>

                    {/* Right: content */}
                    <div className="max-w-2xl">
                      <span className="mb-2 inline-block font-mono text-[11px] tracking-widest text-primary/80 uppercase">
                        {service.label}
                      </span>
                      <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        {service.title}
                      </h3>
                      <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                        {service.longDescription}
                      </p>
                      <Link
                        href={`/services/${service.slug}`}
                        className="mt-5 inline-flex items-center gap-1 font-mono text-sm text-primary transition-colors hover:text-primary/80"
                      >
                        Learn more &rarr;
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Transition: light → dark ── */}
      <div
        className="h-8 md:h-12"
        style={{ background: "linear-gradient(to bottom, #FAFAF9, #0A0A0B)" }}
        aria-hidden="true"
      />

      {/* ── 3. How We Work (dark) — 4-column process grid ── */}
      <section className="py-12 md:py-16">
        <Container>
          <FadeIn>
            <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // process
            </span>
            <Heading size="h2" as="h2" className="mb-4">
              How We Work
            </Heading>
            <p className="mb-8 max-w-lg text-lg text-muted-foreground md:mb-10">
              {processTagline}
            </p>
          </FadeIn>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-0">
            {processSteps.map((step, i) => (
              <FadeIn key={step.number} delay={i * 0.1}>
                <div
                  className={`relative md:pl-6 md:pr-4 ${i > 0 ? "md:border-l md:border-border" : ""}`}
                >
                  <span className="text-5xl font-extralight leading-none tracking-tight text-foreground/10 md:text-6xl">
                    {String(step.number).padStart(2, "0")}
                  </span>
                  <p className="mt-3 font-mono text-[11px] tracking-widest text-primary/80 uppercase">
                    {step.label}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. Values band (dark) — honest commitments, not fake metrics ── */}
      <section className="border-t border-border py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-0">
            {[
              {
                headline: "Live in weeks",
                description: "Most engagements deploy in under two weeks — not months of scoping.",
              },
              {
                headline: "Zero lock-in",
                description: "Month-to-month. Your agents earn their place or we haven't built them right.",
              },
              {
                headline: "Your tools, not ours",
                description: "We build inside your existing stack. Nothing gets replaced.",
              },
            ].map((v, i) => (
              <FadeIn key={v.headline} delay={i * 0.1}>
                <div
                  className={`text-center sm:text-left md:pl-6 md:pr-4 ${i > 0 ? "md:border-l md:border-border" : ""}`}
                >
                  <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    {v.headline}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {v.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <p
              className="mx-auto mt-10 max-w-2xl text-center text-xl leading-relaxed italic text-foreground/80 md:mt-12 md:text-2xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              We build agents that handle the work your team shouldn&apos;t be doing.
              Nothing more, nothing less.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── 5. CTA (dark) — serif text reveal ── */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <ScrollTextReveal className="mt-5" start={85} end={55}>
              <p
                className="text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.2] text-foreground/90"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                Tell us where the bottlenecks are. We&apos;ll show you what
                agents can do.
              </p>
            </ScrollTextReveal>
            <FadeIn delay={0.3}>
              <Button asChild size="lg" className="btn-glow mt-8">
                <Link href="/contact">Book an Audit</Link>
              </Button>
            </FadeIn>
          </div>
        </Container>
      </section>
    </>
  );
}
