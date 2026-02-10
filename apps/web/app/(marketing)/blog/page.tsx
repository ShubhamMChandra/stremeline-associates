import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Badge, Button } from "@repo/ui";
import { FadeIn, AnimateOnScroll } from "@repo/animation";
import { ScrollTextReveal } from "../../../src/components/ui/scroll-text-reveal";

/**
 * What this does: Blog listing page with atmospheric hero, featured post layout, and newsletter CTA
 * Why it's here: Content marketing and SEO — establishes Stremeline as thought leaders in AI automation
 * How it works: Hero with gradient blobs, featured post as a full-width card in a light section,
 *   additional posts in a grid, and a serif CTA for newsletter/contact
 * Dependencies: @repo/ui, @repo/animation
 */

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on AI automation, agent workflows, and operational efficiency for SMBs.",
};

const posts = [
  {
    slug: "why-ai-agents-not-chatbots",
    title: "Why AI Agents, Not Chatbots, Are the Future of SMB Operations",
    description:
      "Chatbots answer questions. AI agents take action. Here's why that distinction matters for your business.",
    publishedAt: "2025-01-20",
    tags: ["AI Agents", "Operations"],
    featured: true,
  },
];

export default function BlogPage() {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <>
      {/* ── Hero — atmospheric ── */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20">
        {/* Ambient gradient blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -left-1/4 -top-1/4 h-[250px] w-[250px] animate-[drift_20s_ease-in-out_infinite] rounded-full bg-amber-500/10 blur-[100px] lg:h-[500px] lg:w-[500px]" />
          <div className="absolute -right-1/4 top-1/3 h-[200px] w-[200px] animate-[drift_25s_ease-in-out_infinite_reverse] rounded-full bg-sky-500/[0.05] blur-[80px] lg:h-[400px] lg:w-[400px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "256px 256px",
            }}
          />
        </div>

        <Container className="relative z-10">
          <FadeIn>
            <span className="mb-4 inline-block font-mono text-xs tracking-widest text-primary/80 uppercase">
              // insights
            </span>
            <Heading size="h1" as="h1">
              Insights
            </Heading>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Thoughts on AI automation, agent workflows, and building more
              leveraged businesses.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── Featured Post — light section, full-width ── */}
      {featured && (
        <section className="light bg-background py-20 md:py-28">
          <Container>
            <AnimateOnScroll>
              <Link
                href={`/blog/${featured.slug}`}
                className="group block"
              >
                <div className="card-lift rounded-xl border border-border bg-card p-8 md:p-12">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {featured.tags.map((tag) => (
                      <Badge key={tag} variant="mono">{tag}</Badge>
                    ))}
                    <span className="text-xs text-muted-foreground">
                      {new Date(featured.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h2 className="text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors md:text-3xl max-w-2xl">
                    {featured.title}
                  </h2>

                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                    {featured.description}
                  </p>

                  <p className="mt-8 font-mono text-xs text-primary/70 group-hover:text-primary transition-colors">
                    Read article &rarr;
                  </p>
                </div>
              </Link>
            </AnimateOnScroll>
          </Container>
        </section>
      )}

      {/* ── Additional Posts (if any) — dark section ── */}
      {rest.length > 0 && (
        <section className="py-20 md:py-28">
          <Container>
            <AnimateOnScroll>
              <Heading size="h2" as="h2" className="mb-12">
                More Articles
              </Heading>
            </AnimateOnScroll>

            <div className="grid gap-6 md:grid-cols-2">
              {rest.map((post, i) => (
                <AnimateOnScroll key={post.slug} delay={i * 0.1}>
                  <Link href={`/blog/${post.slug}`}>
                    <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="mono">{tag}</Badge>
                        ))}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {post.description}
                      </p>
                      <p className="mt-4 text-xs text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                </AnimateOnScroll>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── CTA — scroll-driven serif text reveal ── */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <ScrollTextReveal start={85} end={55}>
              <p
                className="text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.2] text-foreground/90"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                Ready to stop doing the work your agents could handle?
              </p>
            </ScrollTextReveal>
            <FadeIn delay={0.3}>
              <Button asChild size="lg" className="btn-glow mt-10">
                <Link href="/contact">Let&apos;s Talk</Link>
              </Button>
            </FadeIn>
          </div>
        </Container>
      </section>
    </>
  );
}
