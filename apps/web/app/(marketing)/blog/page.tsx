import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Badge, Button } from "@repo/ui";
import { FadeIn, AnimateOnScroll } from "@repo/animation";

/**
 * What this does: Blog listing page with atmospheric hero and uniform post grid
 * Why it's here: Content marketing and SEO — establishes Stremeline as thought leaders in AI automation
 * How it works: Hero with gradient blobs, all posts in one consistent card grid, serif CTA at bottom
 * Dependencies: @repo/ui, @repo/animation
 */

export const metadata: Metadata = {
  title: "Insights | Stremeline Associates",
  description:
    "Analysis and perspectives on AI agent automation, operational efficiency, and the future of SMB operations.",
};

const posts = [
  {
    slug: "five-workflows-to-automate-first",
    title: "The Five Workflows That Yield the Highest Automation ROI",
    description:
      "Most SMBs automate the wrong processes first. Our analysis of dozens of engagements reveals five workflows that consistently deliver 60–80% time savings within weeks — with minimal disruption to existing operations.",
    publishedAt: "2026-02-03",
    readingTime: "7 min read",
    tags: ["Operations", "Automation"],
  },
  {
    slug: "why-ai-agents-not-chatbots",
    title: "Beyond Chatbots: Why Autonomous AI Agents Are Reshaping SMB Operations",
    description:
      "The distinction between chatbots and AI agents is not semantic — it is structural. Agents do not wait for input. They monitor, decide, and execute. For SMBs without dedicated operations teams, this shift changes the calculus entirely.",
    publishedAt: "2026-01-20",
    readingTime: "6 min read",
    tags: ["AI Agents", "Strategy"],
  },
  {
    slug: "build-vs-buy-ai-automation",
    title: "Build, Buy, or Partner: A Decision Framework for AI Automation",
    description:
      "The automation landscape offers three paths — DIY tools, platform suites, and custom-built agents. Each carries distinct trade-offs in cost, flexibility, and reliability. Here is a structured framework for choosing the right approach.",
    publishedAt: "2026-01-06",
    readingTime: "8 min read",
    tags: ["Strategy", "Frameworks"],
  },
];

export default function BlogPage() {
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
              Analysis and perspectives on AI automation, operational
              architecture, and the future of work for growth-stage businesses.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── All Posts — single uniform grid ── */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post, i) => (
              <AnimateOnScroll key={post.slug} delay={i * 0.1}>
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="mono">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {post.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-6">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground/50">
                          |
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {post.readingTime}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-primary/80 transition-colors group-hover:text-primary">
                        Read &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA — serif quote ── */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <p
                className="text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.2] text-foreground/90"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
              >
                The highest-performing teams automate the work that does not
                require judgment — and protect the work that does.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <Button asChild size="lg" className="btn-glow mt-10">
                <Link href="/contact">Schedule a Diagnostic</Link>
              </Button>
            </FadeIn>
          </div>
        </Container>
      </section>
    </>
  );
}
