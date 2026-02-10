"use client";

import { Container, Heading } from "@repo/ui";
import { useCases } from "@repo/content";
import { useReducedMotion, AnimateOnScroll } from "@repo/animation";

/**
 * What this does: Light-section use cases — clean vertical list with staggered animations
 * Why it's here: Each use case gets its own row, tight and scannable
 * How it works: Simple vertical layout with numbered items. AnimateOnScroll for entrance.
 *   Alternating subtle background tints for visual rhythm.
 * Dependencies: @repo/ui, @repo/content, @repo/animation
 */

export function UseCases() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="use-cases"
      className="light bg-background pt-8 pb-12 md:pt-10 md:pb-16"
      aria-label="Common use cases"
    >
      <Container>
        {/* Section header */}
        <div className="mb-8">
          <Heading as="h2" size="h2">
            Common Bottlenecks We Fix.
          </Heading>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            The same manual overhead shows up everywhere. These are the patterns
            we automate most.
          </p>
        </div>

        {/* Use case list */}
        <div className="flex flex-col gap-px">
          {useCases.map((useCase, i) => {
            const inner = (
              <div className="flex flex-col gap-4 border-t border-border py-8 md:flex-row md:items-start md:gap-12 md:py-10">
                {/* Number */}
                <span className="flex-shrink-0 text-[clamp(2.5rem,5vw,4rem)] font-extralight leading-none tracking-tight text-muted-foreground/50">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Content */}
                <div className="max-w-xl">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {useCase.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {useCase.description}
                  </p>
                </div>
              </div>
            );

            if (reducedMotion) return <div key={useCase.slug}>{inner}</div>;

            return (
              <AnimateOnScroll key={useCase.slug}>
                {inner}
              </AnimateOnScroll>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
