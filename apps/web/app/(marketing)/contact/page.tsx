import type { Metadata } from "next";
import { Container } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { ContactForm } from "./contact-form";
import { notes, paper, quietLink } from "../../../src/components/site/paper";

/**
 * What this does: Contact page with the lead form on a paper card and what happens next
 * Why it's here: Main conversion page. Visitors fill out the form to book an audit
 * How it works: Server component. Heading and form on the left; next steps as three small sticky
 *   notes, the pilot option, and direct email on the right. Form logic lives in ContactForm.
 * Dependencies: @repo/ui, @repo/animation, ContactForm, paper styles
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
    <section className="pt-16 pb-28 md:pt-24 md:pb-40">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <FadeIn>
            <h1 className="text-[clamp(2.25rem,1.7rem+2vw,3.5rem)] leading-[1.02] font-bold tracking-[-0.035em]">
              Let&apos;s audit your workflows.
            </h1>
            <p className="mt-5 max-w-[32rem] text-[17px] leading-relaxed text-foreground/70">
              Tell us about your business and we&apos;ll show you where AI agents can give your team
              time back.
            </p>
          </FadeIn>
          <FadeIn delay={0.08} className={`mt-10 p-6 md:p-10 ${paper}`}>
            <ContactForm />
          </FadeIn>
        </div>

        <FadeIn delay={0.15} className="lg:col-span-4 lg:col-start-9 lg:pt-36">
          <h2 className="text-[18px] font-semibold tracking-[-0.015em]">What happens next</h2>
          <ol className="mt-5 space-y-3">
            {nextSteps.map((step, i) => (
              <li
                key={step}
                className="flex gap-3 rounded-[3px] p-4 text-[15px] leading-snug font-medium text-[#2B2722] shadow-[0_1px_1px_rgba(60,45,10,0.06),0_10px_18px_-14px_rgba(60,45,10,0.4)]"
                style={{
                  background: notes[i * 2 % notes.length],
                  transform: `rotate(${[-1.2, 0.8, -0.6][i]}deg)`,
                }}
              >
                <span className="text-foreground/50">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[14.5px] leading-relaxed text-foreground/70">
            Not ready to commit? Ask about a pilot. We deploy one exploratory agent so you can see real
            results before scaling.
          </p>
          <p className="mt-6 text-[14.5px] text-foreground/70">
            Or email{" "}
            <a href="mailto:hello@wam.team" className={`font-medium text-foreground ${quietLink}`}>
              hello@wam.team
            </a>
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}
