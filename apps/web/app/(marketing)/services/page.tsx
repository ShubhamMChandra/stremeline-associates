import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Code, Button } from "@repo/ui";
import { AnimateOnScroll, FadeIn } from "@repo/animation";
import { services, useCases, processTagline } from "@repo/content";
import { ServiceCards } from "./service-cards";
import { UseCaseCards } from "./use-case-cards";

/**
 * What this does: Services overview page — capabilities, use cases, and CTA
 * Why it's here: Gives visitors the full picture of what we build
 * How it works: Server component composing client-side interactive card grids
 * Dependencies: @repo/ui, @repo/content, @repo/animation, client card components
 */

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI agent capabilities: lead capture, workflow automation, error reduction, and scaling operations — without adding headcount.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-8 pb-4 md:pt-12 md:pb-6">
        <Container>
          <FadeIn>
            <Code className="mb-4 block">// services</Code>
            <Heading size="h1" as="h1" className="max-w-3xl">
              What We Build
            </Heading>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              AI agent systems that handle the work your team shouldn&apos;t be
              doing manually. We design, build, and deploy — fast.
            </p>
            <div className="mt-4 h-px w-24 bg-gradient-to-r from-amber-500 to-amber-500/0" />
          </FadeIn>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="py-12 md:py-16">
        <Container>
          <ServiceCards services={services} />
        </Container>
      </section>

      {/* Use Cases */}
      <section className="bg-surface/50 py-12 md:py-16">
        <Container>
          <AnimateOnScroll>
            <div className="mb-8">
              <Code className="mb-3 block">// scenarios</Code>
              <Heading size="h2" as="h2">
                Common Use Cases
              </Heading>
            </div>
          </AnimateOnScroll>
          <UseCaseCards useCases={useCases} />
        </Container>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-xs tracking-widest text-amber-500/80 uppercase">
                {processTagline}
              </p>
              <Heading size="h2" as="h2" className="mt-4">
                Let&apos;s discuss your automation needs
              </Heading>
              <p className="mt-4 text-muted-foreground">
                We&apos;ll map your workflows and show you where agents cut the
                overhead. Most teams are live in under two weeks.
              </p>
              <Button asChild size="lg" className="btn-glow mt-8">
                <Link href="/contact">Book an Audit</Link>
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
