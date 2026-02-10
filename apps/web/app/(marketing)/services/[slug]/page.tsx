import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Heading,
  Code,
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui";
import { FadeIn, AnimateOnScroll } from "@repo/animation";
import { services, useCases } from "@repo/content";
import {
  Zap,
  Workflow,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Database,
  Mail,
  ArrowRightLeft,
  Bell,
} from "lucide-react";

/**
 * What this does: Service detail page with full problem/approach/benefits layout
 * Why it's here: Converts B2B prospects by showing depth behind each service offering
 * How it works: Renders 7 sections — hero with atmosphere, problem/approach grid, benefits band,
 *   tools row, use cases with icons, related services, and service-specific CTA.
 * Dependencies: @repo/ui, @repo/content, @repo/animation, lucide-react
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

const serviceIconMap: Record<string, React.ElementType> = {
  zap: Zap,
  workflow: Workflow,
  "shield-check": ShieldCheck,
  "trending-up": TrendingUp,
};

const useCaseIconMap: Record<string, React.ElementType> = {
  "user-plus": UserPlus,
  database: Database,
  mail: Mail,
  "arrow-right-left": ArrowRightLeft,
  bell: Bell,
};

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const relatedUseCases = useCases.filter((uc) =>
    service.useCases.includes(uc.slug),
  );
  const relatedServices = services.filter((s) => s.slug !== slug);

  return (
    <>
      {/* ── 1. Hero — atmospheric opening ── */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16">
        {/* Background atmosphere */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
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
            <Link
              href="/services"
              className="mb-6 inline-flex items-center gap-1 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              &larr; All Services
            </Link>
            <Code className="mb-4 block">{service.label}</Code>
            <Heading size="h1" as="h1" className="max-w-3xl">
              {service.title}
            </Heading>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {service.longDescription}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── 2. Problem / Approach — two-column grid ── */}
      <section className="bg-card py-12 md:py-16">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <AnimateOnScroll>
              <Code className="mb-4 block">// the-problem</Code>
              <Heading size="h3" as="h2" className="mb-4">
                The Problem
              </Heading>
              <p className="text-base leading-relaxed text-muted-foreground">
                {service.problem}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.1}>
              <Code className="mb-4 block">// our-approach</Code>
              <Heading size="h3" as="h2" className="mb-4">
                Our Approach
              </Heading>
              <p className="text-base leading-relaxed text-muted-foreground">
                {service.approach}
              </p>
            </AnimateOnScroll>
          </div>
        </Container>
      </section>

      {/* ── 3. Benefits band ── */}
      <section className="border-t border-border py-12 md:py-16">
        <Container>
          <AnimateOnScroll>
            <Code className="mb-6 block">// outcomes</Code>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-0">
            {service.benefits.map((benefit, i) => (
              <AnimateOnScroll key={benefit} delay={i * 0.1}>
                <div
                  className={`md:pl-6 md:pr-4 ${i > 0 ? "md:border-l md:border-border" : ""}`}
                >
                  <p className="text-base font-medium leading-relaxed text-foreground">
                    {benefit}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. Tools row ── */}
      {service.tools && service.tools.length > 0 && (
        <section className="border-t border-border py-8 md:py-10">
          <Container>
            <AnimateOnScroll>
              <div className="flex flex-wrap items-center gap-3">
                <span className="mr-2 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  Integrates with
                </span>
                {service.tools.map((tool) => (
                  <Badge key={tool} variant="mono">
                    {tool}
                  </Badge>
                ))}
              </div>
            </AnimateOnScroll>
          </Container>
        </section>
      )}

      {/* ── 5. Use Cases ── */}
      {relatedUseCases.length > 0 && (
        <section className="bg-card py-12 md:py-16">
          <Container>
            <AnimateOnScroll>
              <Code className="mb-4 block">// use-cases</Code>
              <Heading size="h2" as="h2" className="mb-10">
                Where This Applies
              </Heading>
            </AnimateOnScroll>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedUseCases.map((uc, i) => {
                const UcIcon = useCaseIconMap[uc.icon];
                return (
                  <AnimateOnScroll key={uc.slug} delay={i * 0.1}>
                    <Card className="card-lift h-full">
                      <CardHeader>
                        <div className="mb-3 flex items-center gap-3">
                          {UcIcon && (
                            <UcIcon
                              className="size-5 text-primary"
                              strokeWidth={1.75}
                            />
                          )}
                          <CardTitle className="text-base">
                            {uc.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardDescription>{uc.description}</CardDescription>
                    </Card>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* ── 6. Related Services ── */}
      <section className="border-t border-border py-12 md:py-16">
        <Container>
          <AnimateOnScroll>
            <Heading size="h3" as="h2" className="mb-8">
              Other Capabilities
            </Heading>
          </AnimateOnScroll>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedServices.map((rs, i) => {
              const RsIcon = serviceIconMap[rs.icon];
              return (
                <AnimateOnScroll key={rs.slug} delay={i * 0.1}>
                  <Link
                    href={`/services/${rs.slug}`}
                    className="group flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/20"
                  >
                    {RsIcon && (
                      <RsIcon
                        className="mt-0.5 size-5 shrink-0 text-primary"
                        strokeWidth={1.75}
                      />
                    )}
                    <div>
                      <h3 className="font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {rs.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {rs.description}
                      </p>
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── 7. CTA — service-specific ── */}
      <section className="py-12 md:py-16">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p
                className="text-xl leading-relaxed text-foreground/80 md:text-2xl"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                {service.ctaLine}
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
