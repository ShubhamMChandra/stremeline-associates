import type { Metadata } from "next";
import { Container, Heading } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { ContactForm } from "./contact-form";
/**
 * What this does: Contact page with atmospheric hero, validated lead capture form, and serif closer
 * Why it's here: Main conversion page — visitors fill out the form to book an audit
 * How it works: Hero with gradient blobs, two-column layout (form + process steps),
 *   serif italic quote as a closer for emotional resonance
 * Dependencies: @repo/ui, @repo/animation, ContactForm
 */

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Let's audit your workflows. Tell us about your business and we'll show you where AI agents can give your team time back.",
};

export default function ContactPage() {
  return (
    <>
      {/* ── Main section with atmosphere ── */}
      <section className="relative overflow-hidden py-20 md:py-24">
        {/* Ambient gradient blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -left-1/4 -top-1/4 h-[250px] w-[250px] animate-[drift_20s_ease-in-out_infinite] rounded-full bg-amber-500/10 blur-[100px] lg:h-[500px] lg:w-[500px]" />
          <div className="absolute right-0 bottom-0 h-[200px] w-[200px] animate-[drift_25s_ease-in-out_infinite_reverse] rounded-full bg-sky-500/[0.05] blur-[80px] lg:h-[400px] lg:w-[400px]" />
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
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Form column */}
            <div>
              <FadeIn>
                <span className="mb-4 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
                  // contact
                </span>
                <Heading size="h1" as="h1" className="mb-2">
                  Let&apos;s audit your workflows.
                </Heading>
                <p className="mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground">
                  Tell us about your business and we&apos;ll show you where AI agents
                  can give your team time back.
                </p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <ContactForm />
              </FadeIn>
            </div>

            {/* Info column */}
            <FadeIn delay={0.3}>
              <div className="space-y-10 lg:pt-24">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-5">What happens next</h3>
                  <ol className="space-y-5">
                    {[
                      "We review your message within 24 hours",
                      "We schedule a 30-minute workflow audit call",
                      "You get a concrete plan for automation",
                    ].map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 font-mono text-sm text-primary">
                          {i + 1}
                        </span>
                        <span className="text-base text-muted-foreground pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground/80">
                    Not ready to commit? Ask about our limited pilot — we deploy a
                    single exploratory agent so you can see real results before
                    scaling.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card/50 p-6">
                  <p
                    className="text-lg leading-relaxed text-foreground/80"
                    style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                  >
                    Most engagements launch in weeks, not months.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Email us directly</h3>
                  <a
                    href="mailto:hello@wam.team"
                    className="text-base text-primary hover:underline"
                  >
                    hello@wam.team
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* ── Closing — serif quote ── */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <p
                className="text-[clamp(1.25rem,2.5vw,2.25rem)] leading-[1.2] text-foreground/90"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                Two weeks from now, your team forgets it was ever manual.
              </p>
            </FadeIn>
          </div>
        </Container>
      </section>
    </>
  );
}
