"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@repo/ui";
import { useReducedMotion } from "@repo/animation";

gsap.registerPlugin(ScrollTrigger);

/**
 * What this does: Full-viewport dark section with three enormous scroll-driven numbers and a serif quote
 * Why it's here: The "typographic wow" — numbers at 15-20vw create the design. Serif quote adds humanity.
 * How it works: GSAP ScrollTrigger with scrub ties number values directly to scroll position.
 *   Numbers count up (or down) as the visitor scrolls through the section.
 * Dependencies: gsap, gsap/ScrollTrigger, @repo/ui, @repo/animation
 */

interface CounterItem {
  from: number;
  to: number;
  suffix: string;
  label: string;
}

// Numbers should be internally consistent with the problem section
// (3.0 hrs/day manual → ~35 min/day = ~2.4 hrs saved/day × 20 days ≈ 48 hrs/month)
const counters: CounterItem[] = [
  { from: 0, to: 50, suffix: "+", label: "hours reclaimed per month" },
  { from: 0, to: 90, suffix: "%", label: "fewer data-entry errors" },
  { from: 5, to: 1, suffix: "", label: "week to first live workflow" },
];

export function CounterWall() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(5);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) {
      setCount1(50);
      setCount2(90);
      setCount3(1);
      return;
    }

    const tween1 = gsap.to({ val: 0 }, {
      val: 50,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        scrub: true,
        start: "top 60%",
        end: "bottom 40%",
      },
      onUpdate: function () {
        setCount1(Math.round(this.targets()[0].val));
      },
    });

    const tween2 = gsap.to({ val: 0 }, {
      val: 90,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        scrub: true,
        start: "top 60%",
        end: "bottom 40%",
      },
      onUpdate: function () {
        setCount2(Math.round(this.targets()[0].val));
      },
    });

    const tween3 = gsap.to({ val: 5 }, {
      val: 1,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        scrub: true,
        start: "top 60%",
        end: "bottom 40%",
      },
      onUpdate: function () {
        setCount3(Math.round(this.targets()[0].val));
      },
    });

    return () => {
      tween1.scrollTrigger?.kill();
      tween2.scrollTrigger?.kill();
      tween3.scrollTrigger?.kill();
    };
  }, [reducedMotion]);

  const values = [
    { value: count1, suffix: counters[0]!.suffix, label: counters[0]!.label },
    { value: count2, suffix: counters[1]!.suffix, label: counters[1]!.label },
    { value: count3, suffix: counters[2]!.suffix, label: counters[2]!.label },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative pt-12 pb-12 md:pt-12 md:pb-16 flex items-center"
    >
      <Container>
        <div className="flex flex-col items-center justify-center w-full">
          {/* ── Counter grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full text-center">
            {values.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span
                  className="text-[clamp(6rem,15vw,18rem)] font-extralight tracking-[-0.05em] leading-none text-foreground"
                >
                  {item.value}
                  {item.suffix}
                </span>
                <span className="text-sm text-muted-foreground mt-4">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* ── Customer quote ── */}
          <blockquote className="mt-12 md:mt-16 max-w-3xl mx-auto text-center">
            <p
              className="text-2xl md:text-3xl leading-relaxed italic text-foreground/90"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              &ldquo;Response times went from hours to minutes. Our reps stopped
              doing data entry and started actually selling.&rdquo;
            </p>
            <footer className="text-sm text-muted-foreground mt-4">
              — B2B Software Company
            </footer>
          </blockquote>
        </div>
      </Container>
    </section>
  );
}
