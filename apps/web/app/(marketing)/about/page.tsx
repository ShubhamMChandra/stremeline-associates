import type { Metadata } from "next";
import { Container } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { PageIntro } from "../../../src/components/site/page-intro";
import { ClosingAsk } from "../../../src/components/site/closing-ask";
import { notes, paper } from "../../../src/components/site/paper";
/**
 * What this does: About page: who we are, what we kept seeing, and what working with us is like
 * Why it's here: Builds conviction in a direct, human voice
 * How it works: Server component. The story sits beside three sticky notes with the chores we kept
 *   seeing; the principles are paper cards; the shared ask closes the page.
 * Dependencies: @repo/ui, @repo/animation, site components
 */

export const metadata: Metadata = {
  title: "About",
  description:
    "WAM is a small studio of engineers that builds AI agent workflows for growing businesses. Fast deployment, no lock-in, real results.",
};

const principles = [
  {
    title: "We work inside your tools",
    description:
      "No new platforms to learn. We build agents that plug into the CRM, project management, and communication tools your team already uses. Nothing gets replaced.",
  },
  {
    title: "We move fast",
    description:
      "We audit your workflows, design the agents, and deploy them, usually in under two weeks. Then we iterate based on what's actually happening in your operations.",
  },
  {
    title: "We keep it lean",
    description:
      "Small team, low overhead. You're paying for the engineering work that ships, without an expensive office or a bench of junior consultants.",
  },
];

const seen = [
  { text: "Sorting leads by hand", r: -4 },
  { text: "Copy-pasting between tools", r: 3 },
  { text: "Chasing follow-ups that slipped", r: -2 },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        title="We build AI agents for teams that are growing faster than they can hire."
        lead="WAM is a small studio of entrepreneurs, engineers, and operators. We design agent workflows that handle the repetitive work your team shouldn't be doing, and we get them live fast."
      />

      <section aria-labelledby="seen-title" className="pb-24 md:pb-32">
        <Container className="grid gap-12 md:grid-cols-12 md:gap-8">
          <FadeIn className="md:col-span-6">
            <h2
              id="seen-title"
              className="text-[clamp(1.6rem,1.3rem+1vw,2.25rem)] leading-[1.08] font-bold tracking-[-0.03em]"
            >
              What we kept seeing
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-foreground/75">
              <p>
                Growing companies with great products, where smart people spent half their day on
                tasks a well-designed agent could handle in seconds.
              </p>
              <p>
                The tools available either cost a fortune and take months to set up, or they&apos;re
                too fragile for anything beyond a simple trigger. So teams keep doing it by hand, and
                the bottleneck gets worse the faster the business grows.
              </p>
              <p className="font-medium text-foreground">
                So we set out to build automation that works: scoped to what you need, plugged into
                the tools you already use, and live quickly.
              </p>
            </div>
          </FadeIn>
          <div aria-hidden="true" className="flex items-center justify-center pt-2 md:col-span-5 md:col-start-8 md:pt-16">
            {seen.map((n, i) => (
              <span
                key={n.text}
                className="-ml-2 flex size-[7rem] shrink-0 rounded-[2px] p-3 text-[13.5px] leading-[1.3] font-medium text-[#2B2722] shadow-[0_1px_1px_rgba(60,45,10,0.06),0_12px_20px_-14px_rgba(60,45,10,0.4)] first:ml-0 sm:size-[8.5rem] sm:text-[15px] lg:size-[9.25rem]"
                style={{
                  background: notes[i * 2 % notes.length],
                  transform: `translateY(${(i % 2) * 14}px) rotate(${n.r}deg)`,
                }}
              >
                {n.text}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="get-title" className="pb-24 md:pb-32">
        <Container>
          <FadeIn>
            <h2
              id="get-title"
              className="text-[clamp(1.6rem,1.3rem+1vw,2.25rem)] leading-[1.08] font-bold tracking-[-0.03em]"
            >
              What you get
            </h2>
          </FadeIn>
          <ul className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
            {principles.map((item) => (
              <li key={item.title} className={`p-6 md:p-7 ${paper}`}>
                <h3 className="text-[18px] font-semibold tracking-[-0.015em]">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-foreground/70">{item.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ClosingAsk title="Start a conversation." />
    </>
  );
}
