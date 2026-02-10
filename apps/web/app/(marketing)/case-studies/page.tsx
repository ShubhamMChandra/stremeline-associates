import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Badge, Button } from "@repo/ui";
import { AnimateOnScroll, FadeIn } from "@repo/animation";
import { caseStudies } from "@repo/content";
/**
 * What this does: Case studies page with featured layout and serif CTA
 * Why it's here: Social proof and credibility — shows actual outcomes from AI agent deployments
 * How it works: Server component with atmospheric hero, full-width featured case study
 *   with card-lift hover, and serif CTA.
 * Dependencies: @repo/ui, @repo/content, @repo/animation
 */

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real results from AI agent deployments. See how we've helped SMBs automate operations and scale without hiring.",
};

export default function CaseStudiesPage() {
  const featured = caseStudies[0];
  const rest = caseStudies.slice(1);

  return (
    <>
      {/* ── Hero — atmospheric ── */}
      <section className="relative overflow-hidden pt-20 pb-12 md:pt-28 md:pb-16">
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
              // case studies
            </span>
            <Heading size="h1" as="h1" className="max-w-3xl">
              Real Results, Real Businesses
            </Heading>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              See how AI agents have transformed operations for businesses like yours.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── Featured Case Study — light section, full-width with card-lift ── */}
      {featured && (
        <section className="light bg-background py-16 md:py-20">
          <Container>
            <AnimateOnScroll>
              <Link
                href={`/case-studies/${featured.slug}`}
                className="group block"
              >
                <div className="card-lift rounded-xl border border-border bg-card p-8 md:p-12">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <Badge variant="mono">{featured.industry}</Badge>
                    {featured.client && (
                      <span className="text-sm text-muted-foreground">
                        {featured.client}
                      </span>
                    )}
                  </div>

                  <h2 className="text-3xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors md:text-4xl">
                    {featured.title}
                  </h2>

                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                    {featured.summary}
                  </p>

                  {/* Results — prominent display */}
                  <div className="mt-8 grid gap-8 border-t border-border pt-8 sm:grid-cols-3">
                    {featured.results.slice(0, 3).map((r, j) => (
                      <div key={j}>
                        <span className="text-[clamp(2rem,4vw,3.5rem)] font-extralight leading-none tracking-tight text-primary">
                          {r.after}
                        </span>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {r.metric}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Read more indicator */}
                  <p className="mt-8 font-mono text-xs text-primary/70 group-hover:text-primary transition-colors">
                    Read the full case study &rarr;
                  </p>
                </div>
              </Link>
            </AnimateOnScroll>
          </Container>
        </section>
      )}

      {/* ── Additional Case Studies (if any) — dark section ── */}
      {rest.length > 0 && (
        <section className="py-16 md:py-20">
          <Container>
            <FadeIn>
              <Heading size="h2" as="h2" className="mb-8">
                More Results
              </Heading>
            </FadeIn>

            <div className="grid gap-6 md:grid-cols-2">
              {rest.map((study, i) => (
                <AnimateOnScroll key={study.slug} delay={i * 0.1}>
                  <Link href={`/case-studies/${study.slug}`}>
                    <div className="card-lift group rounded-xl border border-border bg-card p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="mono">{study.industry}</Badge>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {study.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {study.summary}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-4">
                        {study.results.slice(0, 3).map((r, j) => (
                          <div key={j} className="text-xs">
                            <span className="font-semibold text-primary">{r.after}</span>
                            <span className="text-muted-foreground"> — {r.metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                </AnimateOnScroll>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── CTA — serif quote ── */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <p
                className="text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.2] text-foreground/90"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                Your results could be next.
              </p>
            </FadeIn>
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
