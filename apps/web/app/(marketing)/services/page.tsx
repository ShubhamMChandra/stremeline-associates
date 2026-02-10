import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Button } from "@repo/ui";
import { FadeIn, AnimateOnScroll } from "@repo/animation";
import { services, processSteps, processTagline } from "@repo/content";
import { Zap, Workflow, ShieldCheck, TrendingUp } from "lucide-react";
import { ScrollTextReveal } from "../../../src/components/ui/scroll-text-reveal";

/**
 * What this does: Services page — four capabilities as cards, process steps, values, and CTA
 * Why it's here: Dedicated page to explain what Stremeline builds and how they work
 * How it works: Server component with five visually distinct sections. Featured first service card
 *   + 3-card grid, atmospheric hero, process steps, values with amber borders, serif CTA.
 *   Light/dark alternation with gradient transitions for visual rhythm.
 * Dependencies: @repo/ui, @repo/content, @repo/animation, lucide-react, ScrollTextReveal
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

      {/* ── 2. Services deep-dive (light) — uniform 2×2 card grid ── */}
      <section className="light bg-background py-16 md:py-20">
        <Container>
          <FadeIn>
            <Heading size="h2" as="h2" className="mb-4">
              Core Capabilities
            </Heading>
            <p className="mb-10 max-w-lg text-lg text-muted-foreground md:mb-14">
              Four automation pillars. Each one removes a specific category of
              manual work from your operations.
            </p>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon];
              return (
                <AnimateOnScroll key={service.slug} delay={i * 0.1}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group block h-full"
                  >
                    <div className="card-lift flex h-full flex-col rounded-xl border border-border bg-card p-6 md:p-8">
                      <div className="mb-5 flex items-center gap-3">
                        {Icon && (
                          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                            <Icon
                              className="size-5 text-primary"
                              strokeWidth={1.75}
                            />
                          </div>
                        )}
                        <span className="font-mono text-[11px] tracking-widest text-primary/80 uppercase">
                          {service.label}
                        </span>
                      </div>

                      <h3 className="text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-3xl">
                        {service.title}
                      </h3>

                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                        {service.description}
                      </p>

                      {/* Tools badges */}
                      {service.tools && service.tools.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border pt-5">
                          {service.tools.slice(0, 4).map((tool) => (
                            <span
                              key={tool}
                              className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                            >
                              {tool}
                            </span>
                          ))}
                          {service.tools.length > 4 && (
                            <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                              +{service.tools.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-primary/70 transition-colors group-hover:text-primary">
                        Learn more &rarr;
                      </span>
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Social proof (light) — quote + metrics ── */}
      <section className="light bg-background border-t border-border py-12 md:py-16">
        <Container>
          <AnimateOnScroll>
            <div className="mx-auto max-w-3xl text-center">
              <p
                className="text-lg leading-relaxed text-foreground/80 md:text-xl"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                &ldquo;Response times went from hours to minutes. Our reps
                stopped doing data entry and started actually selling.&rdquo;
              </p>
              <p className="mt-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                B2B Software Company
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.15}>
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-6 text-center">
              {[
                { value: "< 5 min", label: "Response time" },
                { value: "0%", label: "Leads dropped" },
                { value: "12 hrs/wk", label: "Admin time saved" },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="font-mono text-2xl font-light text-primary md:text-3xl">
                    {stat.value}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.25}>
            <div className="mt-8 text-center">
              <Link
                href="/case-studies/b2b-software-lead-automation"
                className="font-mono text-xs text-primary/70 transition-colors hover:text-primary"
              >
                Read the full case study &rarr;
              </Link>
            </div>
          </AnimateOnScroll>
        </Container>
      </section>

      {/* ── Transition: light → dark ── */}
      <div
        className="h-8 md:h-12"
        style={{ background: "linear-gradient(to bottom, #FAFAF9, #0A0A0B)" }}
        aria-hidden="true"
      />

      {/* ── 3. How We Work (dark) — 4-column process grid ── */}
      <section className="py-16 md:py-20">
        <Container>
          <FadeIn>
            <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // process
            </span>
            <Heading size="h2" as="h2" className="mb-4">
              How We Work
            </Heading>
            <p className="mb-10 max-w-lg text-lg text-muted-foreground md:mb-14">
              {processTagline}
            </p>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-0">
            {processSteps.map((step, i) => (
              <AnimateOnScroll key={step.number} delay={i * 0.1}>
                <div
                  className={`relative rounded-lg p-5 md:rounded-none md:p-0 md:pl-6 md:pr-4 ${
                    i > 0 ? "md:border-l md:border-border" : ""
                  }`}
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
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. Values band (dark) — commitments with amber left borders ── */}
      <section className="bg-card py-16 md:py-20">
        <Container>
          <FadeIn>
            <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // commitments
            </span>
            <Heading size="h3" as="h2" className="mb-10">
              How We Operate
            </Heading>
          </FadeIn>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                headline: "Live in weeks",
                description:
                  "Most engagements deploy in under two weeks — not months of scoping.",
              },
              {
                headline: "Zero lock-in",
                description:
                  "Month-to-month. Your agents earn their place or we haven't built them right.",
              },
              {
                headline: "Your tools, not ours",
                description:
                  "We build inside your existing stack. Nothing gets replaced.",
              },
            ].map((v, i) => (
              <AnimateOnScroll key={v.headline} delay={i * 0.1}>
                <div className="rounded-lg border border-border bg-background p-6 pl-5">
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                      {v.headline}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {v.description}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <FadeIn>
            <div className="mt-12 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent md:mt-16" />
            <p
              className="mx-auto mt-10 max-w-2xl text-center text-xl leading-relaxed text-foreground/80 md:mt-12 md:text-2xl"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            >
              We build agents that handle the work your team shouldn&apos;t be
              doing. Nothing more, nothing less.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── 5. CTA (dark) — serif text reveal ── */}
      <section className="py-16 md:py-20">
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
