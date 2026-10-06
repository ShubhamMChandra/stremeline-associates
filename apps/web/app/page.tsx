import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@repo/ui";
import { services, caseStudies } from "@repo/content";
import { FadeIn } from "@repo/animation";
import { Header } from "../src/components/layout/header";
import { Footer } from "../src/components/layout/footer";
import { StickyPile } from "../src/components/home/sticky-pile";

/**
 * What this does: Home page. A sticky-note pile to play with, then services, one result, and an ask
 * Why it's here: Main entry point. The pile is the one loud moment and shows the method by letting
 *   visitors hand off chores themselves; everything after it stays short and quiet
 * How it works: Server component on a single paper ground. Only the pile is a client component.
 * Dependencies: @repo/ui, @repo/content, @repo/animation, lucide-react, Header, Footer, StickyPile
 */

const tabs = ["#FFE9A8", "#CDE3F2", "#CFE6D2", "#F9D3DA"];

const link =
  "underline decoration-foreground/30 underline-offset-[5px] transition-colors hover:decoration-foreground";

// Minutes, so the bars compare like with like
const responseBars = [
  { label: "Before", value: "4+ hours", width: "100%" },
  { label: "After", value: "Under 5 minutes", width: "2%" },
];

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
            <ul className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-5">
              {services.map((s, i) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group relative flex h-full flex-col rounded-2xl bg-surface p-6 pt-9 shadow-[0_1px_2px_rgba(60,45,10,0.06),0_18px_36px_-26px_rgba(60,45,10,0.35)] transition-transform duration-300 hover:-translate-y-0.5 md:p-8 md:pt-11"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-6 h-3 w-12 rounded-b-[3px] md:left-8"
                      style={{ background: tabs[i % tabs.length] }}
                    />
                    <h3 className="text-[22px] leading-tight font-semibold tracking-[-0.02em]">{s.title}</h3>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-foreground/70">{s.description}</p>
                    <p className="mt-6 flex items-center justify-between gap-4 text-[13px] text-muted-foreground">
                      <span>{s.tools?.slice(0, 4).join(", ")}</span>
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 shrink-0 text-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                      />
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
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
                <div className="rounded-2xl bg-surface p-6 shadow-[0_1px_2px_rgba(60,45,10,0.06),0_18px_36px_-26px_rgba(60,45,10,0.35)] md:p-8">
                  <p className="text-[14px] font-medium">Time to first response</p>
                  <div className="mt-4 space-y-3">
                    {responseBars.map((b) => (
                      <div key={b.label} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-3">
                        <span className="text-[13px] text-muted-foreground">{b.label}</span>
                        <div className="flex items-center gap-3">
                          <span
                            className={
                              b.label === "After"
                                ? "h-3 min-w-3 rounded-full bg-marker"
                                : "h-3 rounded-full bg-foreground/15"
                            }
                            style={{ width: b.width }}
                          />
                          <span className="shrink-0 text-[13px] font-medium">{b.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
                    {study.results.slice(1).map((r) => (
                      <div key={r.metric} className="flex flex-col-reverse justify-end">
                        <dt className="mt-2 text-[13px] leading-snug text-muted-foreground">{r.metric}</dt>
                        <dd className="text-[22px] leading-none font-semibold tracking-[-0.02em]">{r.after}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </FadeIn>
            </Container>
          </section>
        )}

        {/* Ask */}
        <section aria-labelledby="cta-title" className="pb-28 md:pb-40">
          <Container>
            <FadeIn>
              <h2
                id="cta-title"
                className="text-[clamp(2rem,1.5rem+2vw,3.25rem)] leading-[1.02] font-bold tracking-[-0.035em]"
              >
                Send us your pile.
              </h2>
              <p className="mt-4 max-w-[32rem] text-[16px] leading-relaxed text-foreground/70">
                It starts with a 30-minute call about one process. Most agents are live within two
                weeks, and you pay month to month.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-colors hover:bg-foreground/85"
                >
                  Book a workflow audit
                </Link>
                <a href="mailto:hello@wam.team" className={`text-[15px] ${link}`}>
                  hello@wam.team
                </a>
              </div>
            </FadeIn>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
