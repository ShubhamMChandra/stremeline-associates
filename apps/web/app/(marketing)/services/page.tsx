import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { processSteps, processTagline } from "@repo/content";
import { PageIntro } from "../../../src/components/site/page-intro";
import { ServiceCards } from "../../../src/components/site/service-cards";
import { ClosingAsk } from "../../../src/components/site/closing-ask";
import { ProcessMarkup } from "../../../src/components/home/process-markup";
import { notes, paper, quietLink } from "../../../src/components/site/paper";

/**
 * What this does: Services page. The four services, a marked-up process, how an engagement runs,
 *   one client line, and the closing ask
 * Why it's here: Explains what WAM builds and shows how we look at a process before building
 * How it works: Server component on the paper ground. Services and the ask are shared components;
 *   the marked-up process document is the one interactive object on the page
 * Dependencies: @repo/ui, @repo/content, @repo/animation, site components, ProcessMarkup
 */

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI agent capabilities: lead capture, workflow automation, error reduction, and scaling operations without adding headcount.",
};

const commitments = ["Live in under two weeks", "Month to month", "Works inside your stack"];

const h2 = "text-[clamp(1.6rem,1.3rem+1vw,2.25rem)] leading-[1.08] font-bold tracking-[-0.03em]";

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        title="What we build"
        lead="AI agent systems that handle the work your team shouldn't be doing by hand. We design, build, and deploy them quickly."
      >
        <ul className="mt-7 flex flex-wrap gap-2">
          {commitments.map((c) => (
            <li key={c} className="rounded-full bg-surface px-3.5 py-1.5 text-[13.5px] ring-1 ring-foreground/10">
              {c}
            </li>
          ))}
        </ul>
      </PageIntro>

      <section aria-label="Services" className="pb-24 md:pb-32">
        <Container>
          <ServiceCards />
        </Container>
      </section>

      <section aria-labelledby="markup-title" className="pb-24 md:pb-32">
        <Container>
          <FadeIn className="max-w-[38rem]">
            <h2 id="markup-title" className={h2}>
              How we read a process
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-foreground/70">
              We take the process the way your team wrote it and highlight what an agent can do. The
              rest stays with your team.
            </p>
          </FadeIn>
          <div className="mt-10">
            <ProcessMarkup />
          </div>
        </Container>
      </section>

      <section aria-labelledby="steps-title" className="pb-24 md:pb-32">
        <Container>
          <FadeIn>
            <h2 id="steps-title" className={h2}>
              How an engagement runs
            </h2>
            <p className="mt-4 text-[16px] text-foreground/70">{processTagline}</p>
          </FadeIn>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {processSteps.map((step, i) => (
              <li key={step.number} className={`p-6 ${paper}`}>
                <span
                  className="inline-flex size-7 items-center justify-center rounded-full text-[13px] font-semibold"
                  style={{ background: notes[i % notes.length] }}
                >
                  {step.number}
                </span>
                <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.01em]">{step.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-foreground/70">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-label="What a client said" className="pb-24 md:pb-32">
        <Container>
          <FadeIn>
            <figure className="max-w-[46rem]">
              <blockquote className="text-[clamp(1.35rem,1.1rem+1vw,1.9rem)] leading-[1.3] font-medium tracking-[-0.015em]">
                &ldquo;Response times went from hours to minutes. Our reps stopped doing data entry and
                started actually selling.&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-muted-foreground">
                <span>B2B software company</span>
                <Link href="/case-studies/b2b-software-lead-automation" className={`text-foreground ${quietLink}`}>
                  Read the case study
                </Link>
              </figcaption>
            </figure>
          </FadeIn>
        </Container>
      </section>

      <ClosingAsk
        title="Tell us where the bottlenecks are."
        lead="We'll show you what agents can do with them. It starts with a 30-minute call about one process."
      />
    </>
  );
}
