import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Code, Card, CardHeader, CardTitle, CardDescription, Badge } from "@repo/ui";
import { AnimateOnScroll, FadeIn } from "@repo/animation";
import { caseStudies } from "@repo/content";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real results from AI agent deployments. See how we've helped SMBs automate operations and scale without hiring.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <section className="py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <FadeIn>
            <Code className="mb-4 block">// case-studies</Code>
            <Heading size="h1" as="h1" className="max-w-3xl">
              Real Results, Real Businesses
            </Heading>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              See how AI agents have transformed operations for businesses like yours.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="pb-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {caseStudies.map((study, i) => (
              <AnimateOnScroll key={study.slug} delay={i * 0.1}>
                <Link href={`/case-studies/${study.slug}`}>
                  <Card className="group h-full cursor-pointer transition-all hover:border-amber-500/20">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="mono">{study.industry}</Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-amber-500 transition-colors">
                        {study.title}
                      </CardTitle>
                    </CardHeader>
                    <CardDescription>{study.summary}</CardDescription>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {study.results.slice(0, 3).map((r, j) => (
                        <div key={j} className="text-xs">
                          <span className="font-semibold text-amber-500">{r.after}</span>
                          <span className="text-muted-foreground"> — {r.metric}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
