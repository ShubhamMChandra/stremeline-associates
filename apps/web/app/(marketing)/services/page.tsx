import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Button } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { services, useCases, processTagline } from "@repo/content";
import { Zap, Workflow, ShieldCheck, TrendingUp } from "lucide-react";
import { ScrollAssembly } from "../../../src/components/ui/scroll-assembly";
import { ScrollCounter } from "../../../src/components/ui/scroll-counter";
import { ScrollTextReveal } from "../../../src/components/ui/scroll-text-reveal";

/**
 * What this does: Services page with custom scroll-driven interactions on every section
 * Why it's here: Gives visitors the full picture of what we build — every section has its own moment
 * How it works: Server component composing client interactive components.
 *   Capabilities scatter-to-grid on scroll, stat numbers count on scroll,
 *   CTA text reveals via clip-path on scroll. No basic fade-ins.
 * Dependencies: @repo/ui, @repo/content, @repo/animation, lucide-react, custom scroll components
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
      {/* ── 1. Hero (dark) — atmospheric with proof stats ── */}
      <section className="relative overflow-hidden pt-24 pb-14 md:pt-28 md:pb-16">
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
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              AI agent systems that handle the work your team shouldn&apos;t be
              doing manually. We design, build, and deploy — fast.
            </p>

            <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:gap-8">
              {[
                { value: "4", label: "core capabilities" },
                { value: "15+", label: "platforms connected" },
                { value: "< 2 wks", label: "to go live" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <span className="font-mono text-sm font-semibold text-primary">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ── 2. Capabilities (light) — GSAP scatter-to-grid assembly ── */}
      <section className="light bg-background py-16 md:py-20">
        <Container>
          <FadeIn>
            <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // capabilities
            </span>
            <Heading size="h2" as="h2" className="mb-10">
              Core Capabilities
            </Heading>
          </FadeIn>

          <ScrollAssembly className="grid gap-5 md:grid-cols-2">
            {services.map((service) => {
              const Icon = iconMap[service.icon];
              return (
                <div
                  key={service.slug}
                  data-assembly-item
                  className="card-lift group rounded-xl border border-border bg-card p-6 md:p-8"
                >
                  <div className="mb-4 flex items-center gap-3">
                    {Icon && (
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="size-5 text-primary" strokeWidth={1.75} />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-foreground">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.longDescription}
                  </p>
                </div>
              );
            })}
          </ScrollAssembly>
        </Container>
      </section>

      {/* ── 3. Stat band (dark) — scroll-driven counting numbers ── */}
      <section className="border-y border-border py-14 md:py-16">
        <Container>
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <ScrollCounter
                from={0}
                to={50}
                suffix="+"
                className="text-3xl font-extralight tracking-tight text-foreground md:text-4xl"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                hours reclaimed / month
              </p>
            </div>
            <div>
              <ScrollCounter
                from={0}
                to={90}
                suffix="%"
                className="text-3xl font-extralight tracking-tight text-foreground md:text-4xl"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                fewer data-entry errors
              </p>
            </div>
            <div>
              <ScrollCounter
                from={5}
                to={1}
                className="text-3xl font-extralight tracking-tight text-foreground md:text-4xl"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                week to first live workflow
              </p>
            </div>
            <div>
              <span className="text-3xl font-extralight tracking-tight text-foreground md:text-4xl">
                0
              </span>
              <p className="mt-2 text-xs text-muted-foreground">
                lock-in contracts
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 4. Use Cases (light) — numbered rows with hover highlight ── */}
      <section className="light bg-background py-16 md:py-20">
        <Container>
          <FadeIn>
            <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // use cases
            </span>
            <Heading size="h2" as="h2" className="mb-8">
              Common Bottlenecks We Fix
            </Heading>
          </FadeIn>

          <div>
            {useCases.map((uc, i) => (
              <div
                key={uc.slug}
                className="group -mx-4 flex gap-4 rounded-lg border-t border-border px-4 py-5 transition-colors hover:bg-secondary/50 md:items-baseline md:gap-6 md:py-6"
              >
                <span className="shrink-0 font-mono text-sm text-muted-foreground/50 group-hover:text-primary transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {uc.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {uc.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 5. CTA (dark) — scroll-driven serif text reveal ── */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs tracking-widest text-primary/60 uppercase">
              {processTagline}
            </p>
            <ScrollTextReveal
              className="mt-5"
              start={85}
              end={55}
            >
              <p
                className="text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.2] text-foreground/90"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                Let&apos;s map your workflows and show you where agents cut the overhead.
              </p>
            </ScrollTextReveal>
            <FadeIn delay={0.3}>
              <Button asChild size="lg" className="btn-glow mt-10">
                <Link href="/contact">Book an Audit</Link>
              </Button>
            </FadeIn>
          </div>
        </Container>
      </section>
    </>
  );
}
