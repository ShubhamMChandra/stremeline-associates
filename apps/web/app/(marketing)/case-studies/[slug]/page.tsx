import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Button } from "@repo/ui";
import { FadeIn, AnimateOnScroll } from "@repo/animation";
import { caseStudies } from "@repo/content";

/**
 * What this does: Case study detail page (problem, what we built, results, CTA)
 * Why it's here: Gives prospects the full story behind each deployment
 * How it works: Statically generated per slug. One paper ground, sections separated by
 *   spacing, results as a hairline list instead of boxed cards.
 * Dependencies: @repo/ui, @repo/content, @repo/animation
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.summary,
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) notFound();

  return (
    <>
      {/* Hero */}
      <section className="pt-16 pb-12 md:pt-20 md:pb-16">
        <Container>
          <FadeIn>
            <Link
              href="/case-studies"
              className="mb-8 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; All case studies
            </Link>
            <p className="mb-4 text-sm text-muted-foreground">{study.industry}</p>
            <h1 className="max-w-3xl text-[clamp(2.5rem,1.5rem+4vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-foreground">
              {study.title}
            </h1>
          </FadeIn>
        </Container>
      </section>

      {/* Problem / what we built */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <AnimateOnScroll>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl">
                The problem
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{study.problem}</p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.1}>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl">
                What we built
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{study.solution}</p>
            </AnimateOnScroll>
          </div>
        </Container>
      </section>

      {/* Results */}
      <section className="py-20 md:py-28">
        <Container>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
            The results
          </h2>
          <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
            {study.results.map((result, i) => (
              <li key={i} className="border-t border-border py-6">
                <p className="text-sm text-muted-foreground">{result.metric}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  {result.before ? (
                    <>
                      <span className="text-lg font-normal text-muted-foreground line-through">
                        {result.before}
                      </span>{" "}
                      {result.after}
                    </>
                  ) : (
                    result.after
                  )}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {result.description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn>
            <p className="max-w-2xl text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              This pattern is repeatable across sales, ops, and support teams.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/contact">Let&apos;s build yours</Link>
            </Button>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
