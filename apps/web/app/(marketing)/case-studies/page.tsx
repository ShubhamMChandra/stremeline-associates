import type { Metadata } from "next";
import Link from "next/link";
import { Container, Button } from "@repo/ui";
import { AnimateOnScroll, FadeIn } from "@repo/animation";
import { caseStudies } from "@repo/content";
/**
 * What this does: Case studies index with a featured study and a list of the rest
 * Why it's here: Social proof and credibility. Shows actual outcomes from AI agent deployments
 * How it works: Server component on one paper ground. Hero, featured study set as
 *   editorial type with a results row, remaining studies as a hairline list, plain CTA.
 * Dependencies: @repo/ui, @repo/content, @repo/animation
 */

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Results from AI agent deployments. See how we've helped SMBs automate operations and scale without hiring.",
};

export default function CaseStudiesPage() {
  const featured = caseStudies[0];
  const rest = caseStudies.slice(1);

  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-16">
        <Container>
          <FadeIn>
            <h1 className="max-w-3xl text-[clamp(2.5rem,1.5rem+4vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-foreground">
              Case studies
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              How AI agents have changed day-to-day operations for businesses
              like yours.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── Featured case study ── */}
      {featured && (
        <section className="py-20 md:py-28">
          <Container>
            <AnimateOnScroll>
              <article className="border-t border-border pt-8">
                <p className="text-sm text-muted-foreground">
                  {featured.industry}
                  {featured.client && <> &middot; {featured.client}</>}
                </p>

                <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
                  <Link href={`/case-studies/${featured.slug}`}>
                    {featured.title}
                  </Link>
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  {featured.summary}
                </p>

                <dl className="mt-10 grid gap-6 sm:grid-cols-3">
                  {featured.results.slice(0, 3).map((r, j) => (
                    <div key={j} className="border-t border-border pt-6">
                      <dd className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        {r.before ? (
                          <>
                            <span className="text-lg font-normal text-muted-foreground line-through">
                              {r.before}
                            </span>{" "}
                            {r.after}
                          </>
                        ) : (
                          r.after
                        )}
                      </dd>
                      <dt className="mt-1 text-sm text-muted-foreground">
                        {r.metric}
                      </dt>
                    </div>
                  ))}
                </dl>

                <Link
                  href={`/case-studies/${featured.slug}`}
                  className="mt-8 inline-block text-sm font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  Read the full case study
                </Link>
              </article>
            </AnimateOnScroll>
          </Container>
        </section>
      )}

      {/* ── Additional case studies ── */}
      {rest.length > 0 && (
        <section className="py-20 md:py-28">
          <Container>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
              More case studies
            </h2>

            <ul className="mt-10 border-b border-border">
              {rest.map((study) => (
                <li key={study.slug} className="border-t border-border py-6">
                  <p className="text-sm text-muted-foreground">
                    {study.industry}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                      {study.title}
                    </Link>
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {study.summary}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    {study.results.slice(0, 3).map((r, j) => (
                      <li key={j}>
                        <span className="font-semibold text-foreground">
                          {r.after}
                        </span>
                        <span className="text-muted-foreground">
                          , {r.metric}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn>
            <p className="max-w-2xl text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              Have a process that eats hours every week? Tell us about it.
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
