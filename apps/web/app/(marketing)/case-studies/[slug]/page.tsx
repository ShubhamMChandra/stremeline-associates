import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Heading, Code, Button, Card } from "@repo/ui";
import { FadeIn, AnimateOnScroll } from "@repo/animation";
import { caseStudies } from "@repo/content";

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
      <section className="py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <FadeIn>
            <Link
              href="/case-studies"
              className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; All Case Studies
            </Link>
            <Code className="mb-4 block">// {study.industry.toLowerCase().replace(/\s+/g, "-")}</Code>
            <Heading size="h1" as="h1" className="max-w-3xl">
              {study.title}
            </Heading>
          </FadeIn>
        </Container>
      </section>

      {/* Problem */}
      <section className="bg-surface/50 py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <AnimateOnScroll>
              <div>
                <Code className="mb-3 block">// the-problem</Code>
                <Heading size="h3" as="h2">The Problem</Heading>
                <p className="mt-4 leading-relaxed text-muted-foreground">{study.problem}</p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.2}>
              <div>
                <Code className="mb-3 block">// what-we-built</Code>
                <Heading size="h3" as="h2">What We Built</Heading>
                <p className="mt-4 leading-relaxed text-muted-foreground">{study.solution}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </Container>
      </section>

      {/* Results */}
      <section className="py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <AnimateOnScroll>
            <Code className="mb-4 block">// results</Code>
            <Heading size="h2" as="h2" className="mb-10">The Results</Heading>
          </AnimateOnScroll>
          <div className="grid gap-6 sm:grid-cols-2">
            {study.results.map((result, i) => (
              <AnimateOnScroll key={i} delay={i * 0.1}>
                <Card className="text-center">
                  <div className="p-6">
                    <div className="font-mono text-xs tracking-wider text-amber-500 mb-2">
                      {result.metric}
                    </div>
                    <div className="text-3xl font-bold text-foreground">
                      {result.before ? (
                        <>
                          <span className="text-muted-foreground line-through text-lg">{result.before}</span>
                          {" → "}
                          <span className="text-amber-500">{result.after}</span>
                        </>
                      ) : (
                        <span className="text-amber-500">{result.after}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{result.description}</p>
                  </div>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-lg text-muted-foreground">
                This pattern is repeatable across sales, ops, and support teams.
              </p>
              <Button asChild size="lg" className="mt-8">
                <Link href="/contact">Let&apos;s Build Yours</Link>
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
