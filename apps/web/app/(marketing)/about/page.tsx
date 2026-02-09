import type { Metadata } from "next";
import { Container, Heading, Code } from "@repo/ui";
import { FadeIn, AnimateOnScroll } from "@repo/animation";
import { teamCredentials, processSteps, processTagline } from "@repo/content";
import { SpotlightCard } from "../../../src/components/aceternity/spotlight";
import { Spotlight } from "../../../src/components/aceternity/spotlight";

/**
 * What this does: About page with Spotlight effects and animated process timeline
 * Why it's here: Builds credibility — shows team expertise and working process
 * How it works: Server-rendered metadata with client Spotlight and SpotlightCard effects
 * Dependencies: @repo/ui, @repo/animation, @repo/content, Aceternity (Spotlight, SpotlightCard)
 */

export const metadata: Metadata = {
  title: "About",
  description:
    "A lean automation studio built by Ivy League-trained engineers. Enterprise-grade AI agent systems, cost-effective for SMBs.",
};

const values = [
  {
    title: "Deep Technical Execution",
    description:
      "Our team brings deep expertise in AI, automation, and agent systems — built on years of enterprise engineering experience.",
  },
  {
    title: "Strong Business Judgment",
    description:
      "We don't just build technology. We understand the operational context, so every agent we deploy solves a real business problem.",
  },
  {
    title: "Global Efficient Delivery",
    description:
      "A global network of experienced automation engineers means we deliver fast, efficiently, and cost-effectively.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero with Spotlight */}
      <section className="relative py-[clamp(4rem,3rem+5vw,8rem)]">
        <Spotlight className="-top-40 left-0 md:left-60" />
        <Container className="relative z-10">
          <FadeIn>
            <Code className="mb-4 block">// about</Code>
            <Heading size="h1" as="h1" className="max-w-3xl">
              A lean automation studio built by operators and engineers.
            </Heading>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              {teamCredentials.headline}, supported by {teamCredentials.subheadline.toLowerCase()}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Values with SpotlightCards */}
      <section className="bg-surface/50 py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <AnimateOnScroll>
            <Heading size="h2" as="h2" className="mb-10">
              What Drives Us
            </Heading>
          </AnimateOnScroll>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <AnimateOnScroll key={i} delay={i * 0.1}>
                <SpotlightCard className="h-full p-6">
                  <h3 className="text-lg font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{v.description}</p>
                </SpotlightCard>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <AnimateOnScroll>
            <Code className="mb-4 block">// process</Code>
            <Heading size="h2" as="h2" className="mb-12">
              How We Work
            </Heading>
          </AnimateOnScroll>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-amber-500/50 via-amber-500/20 to-transparent md:left-8 md:block" />

            <div className="space-y-12">
              {processSteps.map((step, i) => (
                <AnimateOnScroll key={step.number} delay={i * 0.15}>
                  <div className="flex gap-6 md:gap-8">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-surface text-amber-500 font-mono text-sm font-bold md:h-16 md:w-16">
                      {step.number}
                    </div>
                    <div className="pt-2">
                      <Code className="mb-1 block">{step.label}</Code>
                      <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-2 max-w-lg text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>

          <AnimateOnScroll delay={0.4}>
            <p className="mt-16 text-center font-mono text-sm text-amber-500">
              {processTagline}
            </p>
          </AnimateOnScroll>
        </Container>
      </section>

      {/* Closing */}
      <section className="border-t border-white/[0.06] py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <FadeIn>
            <p className="mx-auto max-w-xl text-center text-xl font-medium text-foreground">
              &ldquo;{teamCredentials.tagline}&rdquo;
            </p>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
