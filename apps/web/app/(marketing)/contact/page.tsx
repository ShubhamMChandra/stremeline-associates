import type { Metadata } from "next";
import { Container } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { ContactForm } from "./contact-form";
/**
 * What this does: Contact page with a validated lead capture form and next-steps column
 * Why it's here: Main conversion page. Visitors fill out the form to book an audit
 * How it works: Single section on the paper ground. Two-column layout: heading + form on
 *   the left, a plain numbered "what happens next" list and direct email on the right.
 * Dependencies: @repo/ui, @repo/animation, ContactForm
 */

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Let's audit your workflows. Tell us about your business and we'll show you where AI agents can give your team time back.",
};

const nextSteps = [
  "We review your message within 24 hours.",
  "We schedule a 30-minute workflow audit call.",
  "You get a concrete plan for automation.",
];

export default function ContactPage() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Form column */}
          <div>
            <FadeIn>
              <h1 className="text-[clamp(2.5rem,1.5rem+4vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-foreground">
                Let&apos;s audit your workflows.
              </h1>
              <p className="mt-6 mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Tell us about your business and we&apos;ll show you where AI
                agents can give your team time back.
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <ContactForm />
            </FadeIn>
          </div>

          {/* Info column */}
          <FadeIn delay={0.2}>
            <div className="space-y-10 lg:pt-6">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  What happens next
                </h2>
                <ol className="mt-4 border-b border-border">
                  {nextSteps.map((step, i) => (
                    <li
                      key={step}
                      className="flex gap-4 border-t border-border py-4 text-base text-muted-foreground"
                    >
                      <span className="font-medium text-foreground">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  Not ready to commit? Ask about our limited pilot. We deploy a
                  single exploratory agent so you can see real results before
                  scaling.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Most engagements launch within a few weeks.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Email us directly
                </h2>
                <a
                  href="mailto:hello@wam.team"
                  className="mt-2 inline-block text-base font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  hello@wam.team
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
