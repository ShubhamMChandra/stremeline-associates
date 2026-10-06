import type { Metadata } from "next";
import Link from "next/link";
import { Container, Button } from "@repo/ui";
import { FadeIn, AnimateOnScroll } from "@repo/animation";
import { services, processSteps, processTagline } from "@repo/content";

/**
 * What this does: Services page. Four capabilities as a typographic list, a client quote,
 *   process steps, operating commitments, and a closing CTA.
 * Why it's here: Dedicated page to explain what WAM builds and how they work
 * How it works: Server component on a single paper ground. Sections are separated by
 *   spacing, lists use hairline dividers instead of boxed cards. No decorative layers.
 * Dependencies: @repo/ui, @repo/content, @repo/animation
 */

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI agent capabilities: lead capture, workflow automation, error reduction, and scaling operations without adding headcount.",
};

const commitments = [
  {
    headline: "Live in weeks",
    description: "Most engagements deploy in under two weeks.",
  },
  {
    headline: "Zero lock-in",
    description:
      "Month-to-month. Your agents earn their place or we haven't built them right.",
  },
  {
    headline: "Works inside your stack",
    description: "We build inside your existing tools. Nothing gets replaced.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* ── 1. Hero ── */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-16">
        <Container>
          <FadeIn>
            <h1 className="max-w-3xl text-[clamp(2.5rem,1.5rem+4vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-foreground">
              What we build
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              AI agent systems that handle the work your team shouldn&apos;t be
              doing manually. We design, build, and deploy them quickly.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── 2. Capabilities — typographic list with hairlines ── */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
              Core capabilities
            </h2>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
              Four automation pillars. Each one removes a specific category of
              manual work from your operations.
            </p>
          </FadeIn>

          <ul className="mt-10 border-b border-border md:mt-14">
            {services.map((service) => (
              <li key={service.slug} className="grid gap-4 border-t border-border py-6 md:grid-cols-[1fr_1.4fr] md:gap-12 md:py-8">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                    <Link href={`/services/${service.slug}`}>
                      {service.title}
                    </Link>
                  </h3>
                  <div>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    {service.tools && service.tools.length > 0 && (
                      <p className="mt-3 text-sm text-muted-foreground">
                        Works with {service.tools.slice(0, 4).join(", ")}
                        {service.tools.length > 4 &&
                          ` and ${service.tools.length - 4} more`}
                      </p>
                    )}
                    <Link
                      href={`/services/${service.slug}`}
                      className="mt-4 inline-block text-sm font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                      Learn more
                    </Link>
                  </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── 3. Social proof — quote + metrics ── */}
      <section className="py-20 md:py-28">
        <Container>
          <AnimateOnScroll>
            <figure className="max-w-3xl">
              <blockquote className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                &ldquo;Response times went from hours to minutes. Our reps
                stopped doing data entry and started actually selling.&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">
                B2B software company
              </figcaption>
            </figure>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.1}>
            <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-6 border-t border-border pt-6">
              {[
                { value: "< 5 min", label: "Response time" },
                { value: "0%", label: "Leads dropped" },
                { value: "12 hrs/wk", label: "Admin time saved" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dd className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </AnimateOnScroll>

          <Link
            href="/case-studies/b2b-software-lead-automation"
            className="mt-8 inline-block text-sm font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Read the full case study
          </Link>
        </Container>
      </section>

      {/* ── 4. How we work — process steps ── */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
              How we work
            </h2>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
              {processTagline}
            </p>
          </FadeIn>

          <ol className="mt-10 grid gap-x-8 md:mt-14 md:grid-cols-4">
            {processSteps.map((step, i) => (
              <li key={step.number} className="border-t border-border py-6">
                <AnimateOnScroll delay={i * 0.05}>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {step.number}. {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </AnimateOnScroll>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── 5. Commitments ── */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
              How we operate
            </h2>
          </FadeIn>

          <ul className="mt-10 grid gap-x-8 sm:grid-cols-3">
            {commitments.map((v) => (
              <li key={v.headline} className="border-t border-border py-6">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {v.headline}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
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
              Tell us where the bottlenecks are. We&apos;ll show you what agents
              can do.
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
