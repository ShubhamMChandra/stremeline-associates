import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { Container } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { services, useCases } from "@repo/content";
import { PageIntro } from "../../../../src/components/site/page-intro";
import { ServiceCards } from "../../../../src/components/site/service-cards";
import { ClosingAsk } from "../../../../src/components/site/closing-ask";
import { notes, paper } from "../../../../src/components/site/paper";

/**
 * What this does: Service detail page: the problem, our approach, what changes, where it applies
 * Why it's here: Shows the depth behind each service for buyers who want specifics
 * How it works: Server component. Problem and approach sit side by side as paper cards, outcomes
 *   are checked items, use cases are small cards, and the other services reuse the shared cards.
 * Dependencies: @repo/ui, @repo/content, @repo/animation, lucide-react, site components
 */

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

const h2 = "text-[clamp(1.6rem,1.3rem+1vw,2.25rem)] leading-[1.08] font-bold tracking-[-0.03em]";

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const index = services.findIndex((s) => s.slug === slug);
  const relatedUseCases = useCases.filter((uc) => service.useCases.includes(uc.slug));

  return (
    <>
      <PageIntro
        before={
          <Link href="/services" className="text-muted-foreground transition-colors hover:text-foreground">
            &larr; All services
          </Link>
        }
        title={service.title}
        lead={service.longDescription}
      />

      <section aria-label="Problem and approach" className="pb-20 md:pb-28">
        <Container className="grid gap-4 md:grid-cols-2 md:gap-5">
          <FadeIn className={`relative h-full p-7 pt-10 md:p-9 md:pt-12 ${paper}`}>
            <span
              aria-hidden="true"
              className="absolute top-0 left-7 h-3 w-12 rounded-b-[3px] md:left-9"
              style={{ background: notes[3] }}
            />
            <h2 className="text-[20px] font-semibold tracking-[-0.015em]">The problem</h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-foreground/75">{service.problem}</p>
          </FadeIn>
          <FadeIn delay={0.08} className={`relative h-full p-7 pt-10 md:p-9 md:pt-12 ${paper}`}>
            <span
              aria-hidden="true"
              className="absolute top-0 left-7 h-3 w-12 rounded-b-[3px] md:left-9"
              style={{ background: notes[index % 4] }}
            />
            <h2 className="text-[20px] font-semibold tracking-[-0.015em]">Our approach</h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-foreground/75">{service.approach}</p>
          </FadeIn>
        </Container>
      </section>

      <section aria-labelledby="changes-title" className="pb-20 md:pb-28">
        <Container className="grid gap-10 md:grid-cols-12 md:gap-8">
          <FadeIn className="md:col-span-4">
            <h2 id="changes-title" className={h2}>
              What changes
            </h2>
            {service.tools && service.tools.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {service.tools.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-surface px-3 py-1 text-[13px] text-foreground/75 ring-1 ring-foreground/10"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </FadeIn>
          <ul className="grid gap-3 sm:grid-cols-2 md:col-span-8">
            {service.benefits.map((b) => (
              <li key={b} className={`flex items-start gap-3 p-5 ${paper}`}>
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-marker">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-[15px] leading-snug font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {relatedUseCases.length > 0 && (
        <section aria-labelledby="applies-title" className="pb-20 md:pb-28">
          <Container>
            <FadeIn>
              <h2 id="applies-title" className={h2}>
                Where this applies
              </h2>
            </FadeIn>
            <ul className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
              {relatedUseCases.map((uc) => (
                <li key={uc.slug} className={`p-6 ${paper}`}>
                  <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.01em]">{uc.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-foreground/70">{uc.description}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section aria-labelledby="other-title" className="pb-24 md:pb-32">
        <Container>
          <h2 id="other-title" className={h2}>
            Other services
          </h2>
          <div className="mt-8">
            <ServiceCards exclude={service.slug} />
          </div>
        </Container>
      </section>

      <ClosingAsk title={service.ctaLine} />
    </>
  );
}
