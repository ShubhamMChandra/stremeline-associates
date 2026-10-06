import Link from "next/link";
import { Container } from "@repo/ui";
import { services, caseStudies } from "@repo/content";
import { AnimateOnScroll } from "@repo/animation";
import { Header } from "../src/components/layout/header";
import { Footer } from "../src/components/layout/footer";
import { WorkflowMap } from "../src/components/home/workflow-map";

/**
 * What this does: Home page as one continuous page on a single paper ground
 * Why it's here: Main entry point. Leads with the method (a workflow map), then services,
 *   how an engagement runs, one result in large numerals, and an ink panel ask
 * How it works: Server component. Sections are separated by space and alignment changes,
 *   not bands, dividers, or numbered labels. Only the workflow map is a client component.
 * Dependencies: @repo/ui, @repo/content, Header, Footer, WorkflowMap
 */

const steps = [
  { title: "Audit", body: "We sit with your team and find where hours go to work a machine should own." },
  { title: "Map", body: "We draw the process step by step and agree where an agent runs and where a person stays in." },
  { title: "Build", body: "We build inside the tools you already use. Most engagements go live in under two weeks." },
  { title: "Tune", body: "We watch it run on real volume and adjust as the work changes." },
];

const linkClass =
  "text-[15px] font-medium text-foreground underline decoration-foreground/30 underline-offset-[6px] transition-colors hover:decoration-foreground";

export default function HomePage() {
  const study = caseStudies[0];

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="min-h-screen pt-16">
        {/* Hero */}
        <section className="pt-20 pb-16 md:pt-32 md:pb-24">
          <Container className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
            <h1 className="max-w-[14ch] text-[2.75rem] leading-[0.98] font-semibold tracking-[-0.05em] sm:text-7xl lg:text-[6.25rem]">
              AI agents for teams growing faster than they can hire.
            </h1>
            <div className="flex flex-col gap-6 md:w-[340px] md:shrink-0 md:pb-3">
              <p className="text-[17px] leading-relaxed text-muted-foreground">
                We find the repetitive work slowing your operations down, then build
                agents that handle it inside the tools your team already uses.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center bg-foreground px-6 text-[15px] font-medium text-background transition-colors hover:bg-foreground/85"
                >
                  Book a workflow audit
                </Link>
                <a href="#map" className={linkClass}>
                  See a workflow
                </a>
              </div>
              <p className="text-[13px] text-muted-foreground">
                Live in under two weeks. Month-to-month. 15+ platforms connected.
              </p>
            </div>
          </Container>
          <Container className="mt-16 md:mt-24">
            <p className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-foreground/15 pt-5 text-[15px] text-muted-foreground">
              <span className="text-foreground">Works inside</span>
              {["HubSpot", "Salesforce", "Slack", "Notion", "Asana", "Airtable", "Google Sheets", "QuickBooks"].map(
                (t) => (
                  <span key={t}>{t}</span>
                ),
              )}
            </p>
          </Container>
        </section>

        {/* Workflow map */}
        <section id="map" aria-labelledby="map-title" className="scroll-mt-20 pb-24 md:pb-36">
          <Container>
            <h2 id="map-title" className="sr-only">
              Example workflows
            </h2>
            <WorkflowMap />
          </Container>
        </section>

        {/* Services */}
        <section aria-labelledby="services-title" className="pb-24 md:pb-36">
          <Container className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <div className="md:sticky md:top-28 md:self-start">
              <h2
                id="services-title"
                className="text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em]"
              >
                What we build
              </h2>
              <p className="mt-5 max-w-sm text-[17px] leading-relaxed text-muted-foreground">
                Four kinds of work we take off your team&apos;s plate. Most clients
                start with one.
              </p>
            </div>
            <ul>
              {services.map((s) => (
                <li key={s.slug} className="border-t border-foreground/15 last:border-b">
                  <Link
                    href={`/services/${s.slug}`}
                    className="group grid gap-2 py-7 md:grid-cols-[1fr_auto] md:gap-8"
                  >
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.025em] group-hover:underline group-hover:decoration-foreground/30 group-hover:underline-offset-[6px]">
                        {s.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                        {s.longDescription}
                      </p>
                      {s.tools && (
                        <p className="mt-3 font-mono text-xs text-muted-foreground">
                          {s.tools.join(" / ")}
                        </p>
                      )}
                    </div>
                    <span
                      aria-hidden="true"
                      className="hidden text-xl text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground md:block"
                    >
                      &rarr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* How an engagement runs */}
        <section aria-labelledby="process-title" className="pb-24 md:pb-36">
          <Container>
            <h2
              id="process-title"
              className="max-w-2xl text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em]"
            >
              How an engagement runs
            </h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {steps.map((step, i) => (
                <AnimateOnScroll key={step.title} delay={i * 0.08}>
                  <div className="flex items-center gap-3 border-t border-foreground pt-4">
                    <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
                    <h3 className="text-lg font-semibold tracking-[-0.015em]">{step.title}</h3>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </AnimateOnScroll>
              ))}
            </div>
            <p className="mt-14 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
              No long contracts. You pay month to month, and the agents have to keep
              earning their place. Everything runs inside the tools you already use.
            </p>
          </Container>
        </section>

        {/* One result */}
        {study && (
          <section aria-labelledby="result-title" className="pb-24 md:pb-36">
            <Container>
              <AnimateOnScroll>
                <div className="grid gap-6 border-t border-foreground pt-8 md:grid-cols-[1fr_auto] md:items-end">
                  <div>
                    <p className="text-sm text-muted-foreground">Case study. {study.industry}</p>
                    <h2
                      id="result-title"
                      className="mt-3 max-w-2xl text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-[1.15] font-semibold tracking-[-0.03em]"
                    >
                      {study.summary}
                    </h2>
                  </div>
                  <Link href={`/case-studies/${study.slug}`} className={linkClass}>
                    Read the case study
                  </Link>
                </div>
              </AnimateOnScroll>
              <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
                {study.results.map((r, i) => (
                  <AnimateOnScroll key={r.metric} delay={i * 0.08}>
                    <div className="border-t border-border pt-5">
                      <p className="text-[clamp(3rem,1.8rem+4.4vw,6rem)] leading-[0.95] font-semibold tracking-[-0.055em] tabular-nums">
                        {r.after}
                      </p>
                      <p className="mt-4 text-[15px] text-foreground">{r.metric}</p>
                      {r.before && (
                        <p className="mt-1 text-sm text-muted-foreground">Was {r.before}</p>
                      )}
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Ask */}
        <section aria-labelledby="cta-title" className="pb-6 md:pb-8">
          <div className="mx-auto max-w-[1400px] px-3 md:px-6">
            <div className="bg-foreground px-6 py-20 text-background md:px-14 md:py-32">
              <AnimateOnScroll>
                <h2
                  id="cta-title"
                  className="max-w-[16ch] text-[clamp(2.5rem,1.5rem+4.5vw,6rem)] leading-[0.96] font-semibold tracking-[-0.05em]"
                >
                  Which process eats the most hours each week?
                </h2>
                <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                  <p className="max-w-md text-[17px] leading-relaxed text-background/65">
                    A 30-minute call. You leave with a map of one process and where an agent
                    would fit.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <Link
                      href="/contact"
                      className="inline-flex h-12 items-center bg-background px-6 text-[15px] font-medium text-foreground transition-colors hover:bg-background/85"
                    >
                      Book a workflow audit
                    </Link>
                    <a
                      href="mailto:hello@wam.team"
                      className="text-[15px] font-medium text-background underline decoration-background/30 underline-offset-[6px] transition-colors hover:decoration-background"
                    >
                      hello@wam.team
                    </a>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
