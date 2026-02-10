import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Button } from "@repo/ui";
import { AnimateOnScroll, FadeIn } from "@repo/animation";
import { services, useCases, processTagline } from "@repo/content";
import { Zap, Workflow, ShieldCheck, TrendingUp } from "lucide-react";

/**
 * What this does: Services page with atmospheric hero, light capabilities grid, dark use-case rows, and serif CTA
 * Why it's here: Gives visitors the full picture of what we build — each section is a different visual format
 * How it works: Hero with gradient blobs, capabilities in a light section with 3D tilt on lead card,
 *   use cases as alternating rows with oversized numbers, and a serif typographic CTA
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
      {/* ── Hero — atmospheric ── */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20">
        {/* Ambient gradient blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -left-1/4 -top-1/4 h-[250px] w-[250px] animate-[drift_20s_ease-in-out_infinite] rounded-full bg-amber-500/10 blur-[100px] lg:h-[500px] lg:w-[500px]" />
          <div className="absolute -right-1/4 top-1/3 h-[200px] w-[200px] animate-[drift_25s_ease-in-out_infinite_reverse] rounded-full bg-sky-500/[0.05] blur-[80px] lg:h-[400px] lg:w-[400px]" />
          {/* Noise texture */}
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
          </FadeIn>
        </Container>
      </section>

      {/* ── Capabilities — light section, card grid ── */}
      <section className="light bg-background py-20 md:py-28">
        <Container>
          <AnimateOnScroll>
            <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // capabilities
            </span>
            <Heading size="h2" as="h2" className="mb-12">
              Core Capabilities
            </Heading>
          </AnimateOnScroll>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon];
              const isLead = i === 0;

              return (
                <AnimateOnScroll key={service.slug} delay={i * 0.1}>
                  <div
                    className={`rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md ${
                      isLead ? "lg:col-span-2" : ""
                    }`}
                  >
                    {Icon && (
                      <Icon className="mb-4 size-6 text-primary" strokeWidth={1.75} />
                    )}
                    <h3 className="text-lg font-semibold text-foreground">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {service.longDescription}
                    </p>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Use Cases — dark section, alternating rows with oversized numbers ── */}
      <section className="py-20 md:py-28">
        <Container>
          <AnimateOnScroll>
            <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // use cases
            </span>
            <Heading size="h2" as="h2" className="mb-16">
              Common Bottlenecks We Fix
            </Heading>
          </AnimateOnScroll>

          <div className="space-y-0">
            {useCases.map((uc, i) => (
              <AnimateOnScroll key={uc.slug} delay={i * 0.08}>
                <div className="flex flex-col gap-4 border-t border-border py-10 md:flex-row md:items-start md:gap-12 md:py-12">
                  {/* Oversized number */}
                  <div className="flex-shrink-0">
                    <span className="text-[clamp(3rem,6vw,5rem)] font-extralight leading-none tracking-tight text-muted-foreground/20">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="max-w-xl md:pt-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {uc.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {uc.description}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA — serif typographic moment ── */}
      <section className="py-20 md:py-32">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-mono text-xs tracking-widest text-primary/60 uppercase">
                {processTagline}
              </p>
              <p
                className="mt-6 text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.2] text-foreground/90"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                Let&apos;s map your workflows and show you where agents cut the overhead.
              </p>
              <Button asChild size="lg" className="btn-glow mt-10">
                <Link href="/contact">Book an Audit</Link>
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
