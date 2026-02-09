import type { Metadata } from "next";
import { Container, Heading, Code } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { DotBackground } from "../../../src/components/aceternity/dot-background";
import { ContactForm } from "./contact-form";

/**
 * What this does: Contact page with DotBackground and validated lead capture form
 * Why it's here: Main conversion page — visitors fill out the form to book an audit
 * How it works: DotBackground for visual depth, React Hook Form + Zod for validation,
 *   Resend for email notifications
 * Dependencies: @repo/ui, @repo/animation, Aceternity (DotBackground), ContactForm
 */

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Let's audit your workflows. Tell us about your business and we'll show you where AI agents can give your team time back.",
};

export default function ContactPage() {
  return (
    <DotBackground className="min-h-screen" dotColor="rgba(217, 119, 6, 0.08)" gap={32}>
      <section className="py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            {/* Form */}
            <div>
              <FadeIn>
                <Code className="mb-4 block">// contact</Code>
                <Heading size="h1" as="h1" className="mb-2">
                  Let&apos;s audit your workflows.
                </Heading>
                <p className="mb-8 text-muted-foreground">
                  Tell us about your business and we&apos;ll show you where AI agents
                  can give your team time back.
                </p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <ContactForm />
              </FadeIn>
            </div>

            {/* Info */}
            <FadeIn delay={0.3}>
              <div className="space-y-8 lg:pt-24">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">What happens next</h3>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-500/30 font-mono text-xs text-amber-500">1</span>
                      <span>We review your message within 24 hours</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-500/30 font-mono text-xs text-amber-500">2</span>
                      <span>We schedule a 30-minute workflow audit call</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-500/30 font-mono text-xs text-amber-500">3</span>
                      <span>You get a concrete plan for automation</span>
                    </li>
                  </ol>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-surface p-6">
                  <p className="font-mono text-sm text-amber-500">
                    Most engagements launch in weeks, not months.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Email us directly</h3>
                  <a
                    href="mailto:hello@streamlineassociates.com"
                    className="text-sm text-amber-500 hover:underline"
                  >
                    hello@streamlineassociates.com
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>
    </DotBackground>
  );
}
