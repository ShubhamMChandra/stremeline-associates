import type { ReactNode } from "react";
import { Container } from "@repo/ui";
import { FadeIn } from "@repo/animation";

/**
 * What this does: Opening title and lead for inner pages
 * Why it's here: Gives every inner page the same calm, modest opening
 * How it works: Server component; optional children render under the lead (links, chips)
 * Dependencies: @repo/ui, @repo/animation
 */

interface PageIntroProps {
  /** Rendered above the title, e.g. a back link */
  before?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}

export function PageIntro({ before, title, lead, children }: PageIntroProps) {
  return (
    <section className="pt-16 pb-12 md:pt-24 md:pb-16">
      <Container>
        <FadeIn className="max-w-[44rem]">
          {before && <div className="mb-6 text-[14px]">{before}</div>}
          <h1 className="text-[clamp(2.25rem,1.7rem+2vw,3.5rem)] leading-[1.02] font-bold tracking-[-0.035em]">
            {title}
          </h1>
          {lead && (
            <p className="mt-5 max-w-[36rem] text-[17px] leading-relaxed text-foreground/70">{lead}</p>
          )}
          {children}
        </FadeIn>
      </Container>
    </section>
  );
}
