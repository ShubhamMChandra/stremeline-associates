"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button, Container } from "@repo/ui";
import { useReducedMotion, useMagneticCursor } from "@repo/animation";

gsap.registerPlugin(ScrollTrigger);

/**
 * What this does: Typographic crescendo CTA — serif text reveals line-by-line via scroll
 * Why it's here: The emotional close. Type IS the design. Nothing else.
 * How it works: Three lines of serif text animate their clipPath from hidden to visible
 *   as the user scrolls into the section. GSAP ScrollTrigger with scrub. Magnetic button below.
 * Dependencies: gsap, gsap/ScrollTrigger, @repo/ui, @repo/animation
 */

const ctaLines = [
  "Two weeks from now,",
  "your team forgets",
  "it was ever manual.",
];

export function CTASection() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const magnetic = useMagneticCursor(0.15);

  useEffect(() => {
    if (reducedMotion || !linesRef.current) return;

    const lines = linesRef.current.querySelectorAll("[data-cta-line]");

    lines.forEach((line, i) => {
      gsap.fromTo(
        line,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            scrub: true,
            // Stagger the reveals by offsetting start/end per line
            start: `top ${70 - i * 10}%`,
            end: `top ${35 - i * 10}%`,
          },
        },
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === sectionRef.current) t.kill();
      });
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative pt-8 pb-12 md:pt-8 md:pb-16"
      aria-label="Call to action"
    >
      <Container className="flex flex-col items-center text-center">
        {/* Serif text — reveals line by line */}
        <div ref={linesRef} className="space-y-1 md:space-y-2">
          {ctaLines.map((line, i) => (
            <div
              key={i}
              data-cta-line
              className="text-[clamp(2rem,4vw,4.5rem)] font-normal leading-[1.1] tracking-[-0.03em] text-foreground"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                clipPath: reducedMotion ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Single magnetic button */}
        <div
          ref={magnetic.ref}
          onMouseMove={magnetic.onMouseMove}
          onMouseLeave={magnetic.onMouseLeave}
          className="mt-8"
        >
          <Button asChild size="lg" className="btn-glow">
            <Link href="/contact">Start Your Audit</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
