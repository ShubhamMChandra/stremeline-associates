import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Code, Card, CardHeader, CardTitle, CardDescription, Button } from "@repo/ui";
import { AnimateOnScroll, FadeIn } from "@repo/animation";
import { services, useCases, processSteps, processTagline } from "@repo/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI agent capabilities: lead capture, workflow automation, error reduction, and scaling operations — without adding headcount.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <FadeIn>
            <Code className="mb-4 block">// services</Code>
            <Heading size="h1" as="h1" className="max-w-3xl">
              What We Build
            </Heading>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              AI agent systems that handle the work your team shouldn&apos;t be doing manually.
              We design, build, and deploy — fast.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="bg-surface/50 py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service, i) => (
              <AnimateOnScroll key={service.slug} delay={i * 0.1}>
                <Link href={`/services/${service.slug}`}>
                  <Card className="group h-full cursor-pointer transition-all hover:border-amber-500/20">
                    <CardHeader>
                      <Code>{service.label}</Code>
                      <CardTitle className="mt-2 text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardDescription>{service.description}</CardDescription>
                    <p className="mt-4 text-sm font-medium text-amber-500 opacity-0 transition-opacity group-hover:opacity-100">
                      Learn more &rarr;
                    </p>
                  </Card>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* Use Cases */}
      <section className="py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <AnimateOnScroll>
            <Heading size="h2" as="h2" className="mb-10">
              Common Use Cases
            </Heading>
          </AnimateOnScroll>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((uc, i) => (
              <AnimateOnScroll key={uc.slug} delay={i * 0.08}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base">{uc.title}</CardTitle>
                  </CardHeader>
                  <CardDescription>{uc.description}</CardDescription>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <FadeIn>
            <div className="text-center">
              <p className="font-mono text-sm text-amber-500">{processTagline}</p>
              <Heading size="h2" as="h2" className="mt-4">
                Let&apos;s discuss your automation needs
              </Heading>
              <Button asChild size="lg" className="mt-8">
                <Link href="/contact">Book an Audit</Link>
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
