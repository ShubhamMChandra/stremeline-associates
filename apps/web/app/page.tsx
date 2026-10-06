import Link from "next/link";
import { Container } from "@repo/ui";
import { caseStudies } from "@repo/content";
import { FadeIn } from "@repo/animation";
import { Header } from "../src/components/layout/header";
import { Footer } from "../src/components/layout/footer";
import { StickyPile } from "../src/components/home/sticky-pile";
import { ServiceCards } from "../src/components/site/service-cards";
import { ClosingAsk } from "../src/components/site/closing-ask";
import { quietLink as link } from "../src/components/site/paper";
import { ResultsCard } from "../src/components/site/results-card";

/**
 * What this does: Home page. A sticky-note pile to play with, then services, one result, and an ask
 * Why it's here: Main entry point. The pile is the one loud moment and shows the method by letting
 *   visitors hand off chores themselves; everything after it stays short and quiet
 * How it works: Server component on a single paper ground. Only the pile is a client component.
 * Dependencies: @repo/ui, @repo/content, @repo/animation, Header, Footer, StickyPile, site components
 */




export default function HomePage() {
  const study = caseStudies[0];

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="pt-24 pb-20 md:pt-28 md:pb-28">
          <Container>
            <StickyPile
              statement={
                <div>
                  <h1 className="text-[2.5rem] leading-[1] font-bold tracking-[-0.035em] md:text-[2.75rem]">
                    Hand off the busywork.
                  </h1>
                  <p className="mt-4 max-w-[21rem] text-[16px] leading-relaxed text-foreground/70">
                    WAM builds AI agents that take repetitive work off operations teams, inside the
                    tools they already use.
                  </p>
                </div>
              }
            />
          </Container>
        </section>

        {/* Services */}
        <section aria-labelledby="services-title" className="pb-24 md:pb-36">
          <Container>
            <FadeIn className="flex flex-wrap items-end justify-between gap-4">
              <h2
                id="services-title"
                className="text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-[1.05] font-bold tracking-[-0.03em]"
              >
                What we build
              </h2>
              <Link href="/services" className={`text-[15px] ${link}`}>
                All services
              </Link>
            </FadeIn>
            <div className="mt-8 md:mt-10">
              <ServiceCards />
            </div>
          </Container>
        </section>

        {/* One result */}
        {study && (
          <section aria-labelledby="result-title" className="pb-24 md:pb-36">
            <Container className="grid gap-10 md:grid-cols-12 md:gap-8">
              <FadeIn className="md:col-span-5">
                <h2
                  id="result-title"
                  className="text-[clamp(1.5rem,1.25rem+0.8vw,2rem)] leading-[1.1] font-bold tracking-[-0.025em]"
                >
                  A lead pipeline, before and after
                </h2>
                <p className="mt-4 max-w-[26rem] text-[15px] leading-relaxed text-foreground/70">
                  {study.summary}
                </p>
                <Link href={`/case-studies/${study.slug}`} className={`mt-5 inline-block text-[15px] ${link}`}>
                  Read the case study
                </Link>
              </FadeIn>

              <FadeIn className="md:col-span-6 md:col-start-7">
                <ResultsCard study={study} />
              </FadeIn>
            </Container>
          </section>
        )}

        <ClosingAsk />
      </main>
      <Footer />
    </>
  );
}
