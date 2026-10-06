import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { caseStudies } from "@repo/content";
import { PageIntro } from "../../../../src/components/site/page-intro";
import { ClosingAsk } from "../../../../src/components/site/closing-ask";
import { ResultsCard } from "../../../../src/components/site/results-card";
import { notes, paper } from "../../../../src/components/site/paper";


/**
 * What this does: Case study detail: the problem, what we built, and the results
 * Why it's here: Specific proof for buyers who want to see the work
 * How it works: Server component. Problem and build sit side by side as paper cards; results use
 *   the shared results card with each result's note listed beside it.
 * Dependencies: @repo/ui, @repo/content, @repo/animation, site components
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
      <PageIntro
        before={
          <Link href="/case-studies" className="text-muted-foreground transition-colors hover:text-foreground">
            &larr; All case studies
          </Link>
        }
        title={study.title}
        lead={study.industry}
      />

      <section aria-label="Problem and what we built" className="pb-20 md:pb-28">
        <Container className="grid gap-4 md:grid-cols-2 md:gap-5">
          {[
            { title: "The problem", body: study.problem, tab: notes[3] },
            { title: "What we built", body: study.solution, tab: notes[0] },
          ].map((c, i) => (
            <FadeIn key={c.title} delay={i * 0.08} className={`relative h-full p-7 pt-10 md:p-9 md:pt-12 ${paper}`}>
              <span
                aria-hidden="true"
                className="absolute top-0 left-7 h-3 w-12 rounded-b-[3px] md:left-9"
                style={{ background: c.tab }}
              />
              <h2 className="text-[20px] font-semibold tracking-[-0.015em]">{c.title}</h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-foreground/75">{c.body}</p>
            </FadeIn>
          ))}
        </Container>
      </section>

      <section aria-labelledby="results-title" className="pb-24 md:pb-32">
        <Container className="grid gap-10 md:grid-cols-12 md:gap-8">
          <FadeIn className="md:col-span-5">
            <h2
              id="results-title"
              className="text-[clamp(1.6rem,1.3rem+1vw,2.25rem)] leading-[1.08] font-bold tracking-[-0.03em]"
            >
              The results
            </h2>
            <ul className="mt-6 space-y-4">
              {study.results.map((r) => (
                <li key={r.metric} className="text-[15px] leading-relaxed text-foreground/75">
                  <span className="font-medium text-foreground">{r.metric}.</span> {r.description}
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn className="md:col-span-6 md:col-start-7">
            <ResultsCard study={study} />
          </FadeIn>
        </Container>
      </section>

      <ClosingAsk
        title="This pattern repeats across sales, ops, and support teams."
        lead="Tell us which process to start with. It begins with a 30-minute call."
      />
    </>
  );
}
