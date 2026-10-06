import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { quietLink } from "./paper";

/**
 * What this does: The closing ask that ends most pages
 * Why it's here: One consistent, low-key way to book an audit or email
 * How it works: Server component with an overridable title and lead
 * Dependencies: @repo/ui, @repo/animation
 */

interface ClosingAskProps {
  title?: ReactNode;
  lead?: ReactNode;
}

export function ClosingAsk({
  title = "Send us your pile.",
  lead = "It starts with a 30-minute call about one process. Most agents are live within two weeks, and you pay month to month.",
}: ClosingAskProps) {
  return (
    <section aria-labelledby="ask-title" className="pb-28 md:pb-40">
      <Container>
        <FadeIn>
          <h2
            id="ask-title"
            className="max-w-[40rem] text-[clamp(2rem,1.5rem+2vw,3.25rem)] leading-[1.02] font-bold tracking-[-0.035em]"
          >
            {title}
          </h2>
          <p className="mt-4 max-w-[32rem] text-[16px] leading-relaxed text-foreground/70">{lead}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-colors hover:bg-foreground/85"
            >
              Book a workflow audit
            </Link>
            <a href="mailto:hello@wam.team" className={`text-[15px] ${quietLink}`}>
              hello@wam.team
            </a>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
