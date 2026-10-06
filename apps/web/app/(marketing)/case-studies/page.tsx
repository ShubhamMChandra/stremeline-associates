import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { caseStudies } from "@repo/content";
import { PageIntro } from "../../../src/components/site/page-intro";
import { ClosingAsk } from "../../../src/components/site/closing-ask";
import { ResultsCard } from "../../../src/components/site/results-card";
import { notes, paper, quietLink } from "../../../src/components/site/paper";

/**
 * What this does: Case studies index. Each study as a paper card with its results beside it
 * Why it's here: Social proof: specific outcomes from agent deployments
 * How it works: Server component on the paper ground; the shared ask closes the page
 * Dependencies: @repo/ui, @repo/content, @repo/animation, site components
 */

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real results from AI agent deployments. See how we've helped SMBs automate operations and scale without hiring.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageIntro
        title="Case studies"
        lead="What changed after the agents went live, in the client's own numbers."
      />

      <section aria-label="Case studies" className="pb-24 md:pb-32">
        <Container className="space-y-5">
          {caseStudies.map((study, i) => (
            <FadeIn key={study.slug}>
              <article className={`relative grid gap-8 p-7 pt-10 md:grid-cols-12 md:gap-8 md:p-10 md:pt-12 ${paper}`}>
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-7 h-3 w-12 rounded-b-[3px] md:left-10"
                  style={{ background: notes[i % notes.length] }}
                />
                <div className="md:col-span-6">
                  <p className="text-[13.5px] text-muted-foreground">{study.industry}</p>
                  <h2 className="mt-2 text-[clamp(1.4rem,1.2rem+0.8vw,1.9rem)] leading-[1.15] font-bold tracking-[-0.025em]">
                    <Link href={`/case-studies/${study.slug}`} className="hover:underline hover:decoration-foreground/30 hover:underline-offset-[5px]">
                      {study.title}
                    </Link>
                  </h2>
                  <p className="mt-4 text-[15.5px] leading-relaxed text-foreground/70">{study.summary}</p>
                  <Link href={`/case-studies/${study.slug}`} className={`mt-6 inline-block text-[15px] ${quietLink}`}>
                    Read the case study
                  </Link>
                </div>
                <ResultsCard study={study} className="shadow-none ring-1 ring-foreground/10 md:col-span-6" />
              </article>
            </FadeIn>
          ))}
        </Container>
      </section>

      <ClosingAsk title="Have a process that eats hours every week?" />
    </>
  );
}
