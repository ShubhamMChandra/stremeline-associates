import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Button } from "@repo/ui";
import { FadeIn, AnimateOnScroll } from "@repo/animation";
import { services, useCases } from "@repo/content";

/**
 * What this does: Service detail page with problem/approach/benefits layout
 * Why it's here: Converts B2B prospects by showing depth behind each service offering
 * How it works: Single paper ground, sections separated by spacing. Hero, problem/approach
 *   columns, outcomes list, integrations line, use cases and other services as hairline
 *   lists, and a plain service-specific CTA.
 * Dependencies: @repo/ui, @repo/content, @repo/animation
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

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
      {/* ── 1. Hero ── */}
      <section className="pt-16 pb-12 md:pt-20 md:pb-16">
        <Container>
          <FadeIn>
            <Link
              href="/services"
              className="mb-8 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; All services
            </Link>
            <h1 className="max-w-3xl text-[clamp(2.5rem,1.5rem+4vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-foreground">
              {service.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {service.longDescription}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── 2. Problem / approach ── */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <AnimateOnScroll>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl">
                The problem
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {service.problem}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.1}>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl">
                Our approach
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {service.approach}
              </p>
            </AnimateOnScroll>
          </div>
        </Container>
      </section>

      {/* ── 3. Outcomes ── */}
      <section className="py-20 md:py-28">
        <Container>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl">
            What changes
          </h2>
          <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 md:grid-cols-4">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="border-t border-border py-6">
                <p className="text-base font-medium leading-relaxed text-foreground">
                  {benefit}
                </p>
              </li>
            ))}
          </ul>
          {service.tools && service.tools.length > 0 && (
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Integrates with {service.tools.join(", ")}.
            </p>
          )}
        </Container>
      </section>

      {/* ── 4. Use cases ── */}
      {relatedUseCases.length > 0 && (
        <section className="py-20 md:py-28">
          <Container>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl">
              Where this applies
            </h2>
            <ul className="mt-8 border-b border-border">
              {relatedUseCases.map((uc) => (
                <li
                  key={uc.slug}
                  className="grid gap-2 border-t border-border py-6 md:grid-cols-[1fr_2fr] md:gap-12"
                >
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {uc.title}
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {uc.description}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* ── 5. Other services ── */}
      <section className="py-20 md:py-28">
        <Container>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl">
            Other services
          </h2>
          <ul className="mt-8 border-b border-border">
            {relatedServices.map((rs) => (
              <li
                key={rs.slug}
                className="grid gap-2 border-t border-border py-6 md:grid-cols-[1fr_2fr] md:gap-12"
              >
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  <Link
                    href={`/services/${rs.slug}`}
                    className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
                  >
                    {rs.title}
                  </Link>
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {rs.description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── 6. CTA ── */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn>
            <p className="max-w-2xl text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              {service.ctaLine}
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/contact">Book an audit</Link>
            </Button>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
