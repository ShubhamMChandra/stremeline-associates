import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Button } from "@repo/ui";
import { AnimateOnScroll, FadeIn } from "@repo/animation";
import { services, useCases, processTagline } from "@repo/content";
import { Zap, Workflow, ShieldCheck, TrendingUp } from "lucide-react";

/**
 * What this does: Services page — five visually distinct sections with proper dark/light alternation
 * Why it's here: Gives visitors the full picture of what we build
 * How it works: Dark hero → Light capabilities grid → Dark stat band → Light use-case rows → Dark CTA.
 *   Every section is a different format. Cards have hover lift, rows have hover highlight.
 * Dependencies: @repo/ui, @repo/content, @repo/animation, lucide-react
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
        {/* Ambient gradient blobs */}
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

            {/* Proof stats */}
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

      {/* ── 2. Capabilities (light) — card grid with hover lift ── */}
      <section className="light bg-background py-16 md:py-20">
        <Container>
          <AnimateOnScroll>
            <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // capabilities
            </span>
            <Heading size="h2" as="h2" className="mb-10">
              Core Capabilities
            </Heading>
          </AnimateOnScroll>

          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon];

              return (
                <AnimateOnScroll key={service.slug} delay={i * 0.1}>
                  <div className="card-lift group rounded-xl border border-border bg-card p-6 md:p-8">
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
                </AnimateOnScroll>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── 3. Stat band (dark) — visual anchor with big numbers ── */}
      <section className="border-y border-border py-14 md:py-16">
        <Container>
          <AnimateOnScroll>
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {[
                { value: "40+", label: "hours saved / month" },
                { value: "3×", label: "fewer manual errors" },
                { value: "85%", label: "faster response times" },
                { value: "0", label: "lock-in contracts" },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="text-3xl font-extralight tracking-tight text-foreground md:text-4xl">
                    {stat.value}
                  </span>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </Container>
      </section>

      {/* ── 4. Use Cases (light) — numbered rows with hover highlight ── */}
      <section className="light bg-background py-16 md:py-20">
        <Container>
          <AnimateOnScroll>
            <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // use cases
            </span>
            <Heading size="h2" as="h2" className="mb-8">
              Common Bottlenecks We Fix
            </Heading>
          </AnimateOnScroll>

          <div>
            {useCases.map((uc, i) => (
              <AnimateOnScroll key={uc.slug} delay={i * 0.06}>
                <div className="group -mx-4 flex gap-4 rounded-lg border-t border-border px-4 py-5 transition-colors hover:bg-secondary/50 md:items-baseline md:gap-6 md:py-6">
                  {/* Row number */}
                  <span className="shrink-0 font-mono text-sm text-muted-foreground/50 group-hover:text-primary transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Content */}
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {uc.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {uc.description}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 5. CTA (dark) — serif typographic moment ── */}
      <section className="py-16 md:py-24">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-xs tracking-widest text-primary/60 uppercase">
                {processTagline}
              </p>
              <p
                className="mt-5 text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.2] text-foreground/90"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                Let&apos;s map your workflows and show you where agents cut the overhead.
              </p>
              <Button asChild size="lg" className="btn-glow mt-8">
                <Link href="/contact">Book an Audit</Link>
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
