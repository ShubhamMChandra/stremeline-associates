"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Workflow, ShieldCheck, TrendingUp } from "lucide-react";
import { Container, Heading } from "@repo/ui";
import { services } from "@repo/content";
import { useReducedMotion } from "@repo/animation";

gsap.registerPlugin(ScrollTrigger);

/**
 * What this does: Light-section capabilities grid with scroll-driven assembly animation
 * Why it's here: Shows what Stremeline automates — cards scatter to grid as user scrolls
 * How it works: Hand-built CSS Grid with GSAP ScrollTrigger scrub animation. Lead card gets
 *   custom 3D tilt on hover. Light theme wrapper for dark/light contrast.
 * Dependencies: gsap, gsap/ScrollTrigger, @repo/ui, @repo/content, @repo/animation, lucide-react
 */

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  workflow: Workflow,
  "shield-check": ShieldCheck,
  "trending-up": TrendingUp,
};

function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -4;
  const rotateY = ((x - centerX) / centerX) * 4;
  card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function handleMouseLeave(e: React.MouseEvent<HTMLElement>) {
  const card = e.currentTarget;
  card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
  card.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
  setTimeout(() => {
    card.style.transition = "";
  }, 400);
}

export function Capabilities() {
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !gridRef.current) return;

    const trigger = gridRef.current;
    const cards = trigger.querySelectorAll<HTMLElement>("[data-capability-card]");

    // Set scattered starting positions — NO opacity change, cards stay visible
    Array.from(cards).forEach((card, i) => {
      const xOffset = (i % 2 === 0 ? -1 : 1) * (25 + Math.random() * 15);
      const yOffset = 12 + Math.random() * 12;
      const rot = (i % 2 === 0 ? -1 : 1) * (1 + Math.random() * 1.5);
      gsap.set(card, { x: xOffset, y: yOffset, rotation: rot });
    });

    // Animate cards back to grid positions on scroll
    cards.forEach((card) => {
      gsap.to(card, {
        x: 0,
        y: 0,
        rotation: 0,
        ease: "none",
        scrollTrigger: {
          trigger,
          scrub: true,
          start: "top 90%",
          end: "top 50%",
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === trigger) t.kill();
      });
      cards.forEach((card) => {
        gsap.set(card, { clearProps: "all" });
      });
    };
  }, [reducedMotion]);

  return (
    <section className="light overflow-hidden bg-background pt-8 pb-12 md:pt-10 md:pb-16">
      <Container>
        {/* Section intro */}
        <div className="mb-8">
          <span className="mb-3 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
            // capabilities
          </span>
          <Heading as="h2" size="h2">
            What We Automate
          </Heading>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground">
            End-to-end AI agent systems that handle the work your team shouldn&apos;t
            be doing manually.
          </p>
        </div>

        {/* Capabilities grid — cards are visible by default, GSAP hides + animates them */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6"
        >
          {services.map((service, i) => {
            const Icon = iconMap[service.icon];
            const isLead = i === 0;

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                data-capability-card
                className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md hover:border-primary/20 lg:col-span-3"
                // Cards are visible by default (no inline style hiding) — GSAP
                // takes over via useEffect and controls opacity/transform
                {...(isLead
                  ? { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave }
                  : {})}
              >
                {Icon && (
                  <Icon className="mb-4 size-6 text-primary" strokeWidth={1.75} />
                )}
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <span className="mt-3 inline-block font-mono text-xs text-primary/70 group-hover:text-primary transition-colors">
                  Learn more &rarr;
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
