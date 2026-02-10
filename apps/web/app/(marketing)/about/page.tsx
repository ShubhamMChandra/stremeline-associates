import type { Metadata } from "next";
import { Container, Heading } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { teamCredentials, processSteps, processTagline } from "@repo/content";
import { ScrollAssembly } from "../../../src/components/ui/scroll-assembly";
import { ScrollTextReveal } from "../../../src/components/ui/scroll-text-reveal";

/**
 * What this does: About page with scroll-driven interactions — assembly grid, text reveal
 * Why it's here: Builds credibility — shows team expertise and working process
 * How it works: Server component composing client interactive components.
 *   Values scatter-to-grid on scroll. Closing quote clip-path reveals on scroll.
 *   Process steps use CSS hover highlights for interactivity.
 * Dependencies: @repo/ui, @repo/animation, @repo/content, custom scroll components
 */

export const metadata: Metadata = {
  title: "About",
  description:
    "A lean automation studio built by Ivy League-trained engineers. Enterprise-grade AI agent systems, cost-effective for SMBs.",
};

const values = [
  {
    number: "01",
    title: "Deep Technical Execution",
    description:
      "Our team brings deep expertise in AI, automation, and agent systems — built on years of enterprise engineering experience.",
  },
  {
    number: "02",
    title: "Strong Business Judgment",
    description:
      "We don't just build technology. We understand the operational context, so every agent we deploy solves a real business problem.",
  },
  {
    number: "03",
    title: "Global Efficient Delivery",
    description:
      "A global network of experienced automation engineers means we deliver fast, efficiently, and cost-effectively.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero — atmospheric, generous, confident ── */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20">
        {/* Ambient gradient blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -left-1/4 -top-1/4 h-[250px] w-[250px] animate-[drift_20s_ease-in-out_infinite] rounded-full bg-amber-500/10 blur-[100px] lg:h-[500px] lg:w-[500px]" />
          <div className="absolute -right-1/4 top-1/3 h-[200px] w-[200px] animate-[drift_25s_ease-in-out_infinite_reverse] rounded-full bg-sky-500/[0.05] blur-[80px] lg:h-[400px] lg:w-[400px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "256px 256px",
            }}
          />
        </div>

        <Container className="relative z-10">
          <FadeIn>
            <span className="mb-4 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // about
            </span>
            <Heading size="h1" as="h1" className="max-w-3xl">
              A lean automation studio built by operators and engineers.
            </Heading>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {teamCredentials.headline}, supported by {teamCredentials.subheadline.toLowerCase()}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── Values — light section, GSAP scatter-to-grid ── */}
      <section className="light bg-background py-16 md:py-20">
        <Container>
          <FadeIn>
            <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // what drives us
            </span>
            <Heading size="h2" as="h2" className="mb-10">
              Our Principles
            </Heading>
          </FadeIn>

          <ScrollAssembly className="grid gap-8 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.number} data-assembly-item className="group">
                <span className="font-mono text-sm text-muted-foreground/40">
                  {v.number}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
            ))}
          </ScrollAssembly>
        </Container>
      </section>

      {/* ── Process — dark section, numbered rows with hover ── */}
      <section className="py-16 md:py-20">
        <Container>
          <FadeIn>
            <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // how we work
            </span>
            <Heading size="h2" as="h2" className="mb-10">
              Four Steps to Live
            </Heading>
          </FadeIn>

          <div>
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="group -mx-4 flex gap-4 rounded-lg border-t border-border px-4 py-6 transition-colors hover:bg-card/50 md:items-baseline md:gap-8 md:py-8"
              >
                {/* Step number */}
                <span className="shrink-0 font-mono text-sm text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
                  {String(step.number).padStart(2, "0")}
                </span>

                {/* Content */}
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center font-mono text-sm text-primary/70">
            {processTagline}
          </p>
        </Container>
      </section>

      {/* ── Closing — scroll-driven serif text reveal ── */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <ScrollTextReveal start={85} end={55}>
              <p
                className="text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.2] text-foreground/90"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                &ldquo;{teamCredentials.tagline}&rdquo;
              </p>
            </ScrollTextReveal>
          </div>
        </Container>
      </section>
    </>
  );
}
