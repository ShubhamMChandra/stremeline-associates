import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Heading, Code, Button, Card, CardHeader, CardTitle, CardDescription } from "@repo/ui";
import { FadeIn, AnimateOnScroll } from "@repo/animation";
import { services, useCases } from "@repo/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const relatedUseCases = useCases.filter((uc) => service.useCases.includes(uc.slug));

  return (
    <>
      {/* Hero */}
      <section className="py-12 md:py-16">
        <Container>
          <FadeIn>
            <Link
              href="/services"
              className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; All Services
            </Link>
            <Code className="mb-4 block">{service.label}</Code>
            <Heading size="h1" as="h1" className="max-w-3xl">
              {service.title}
            </Heading>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              {service.longDescription}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Related Use Cases */}
      {relatedUseCases.length > 0 && (
        <section className="bg-card py-12 md:py-16">
          <Container>
            <AnimateOnScroll>
              <Heading size="h2" as="h2" className="mb-10">
                Related Use Cases
              </Heading>
            </AnimateOnScroll>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedUseCases.map((uc, i) => (
                <AnimateOnScroll key={uc.slug} delay={i * 0.1}>
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
      )}

      {/* CTA */}
      <section className="py-12 md:py-16">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <Heading size="h3" as="h2">
                Let&apos;s discuss how this applies to your business
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
