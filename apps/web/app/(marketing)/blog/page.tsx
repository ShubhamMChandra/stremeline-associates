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
  title: "Blog",
  description: "Insights on AI automation, agent workflows, and operational efficiency for SMBs.",
};

const posts = [
  {
    slug: "five-workflows-to-automate-first",
    title: "5 Workflows Every SMB Should Automate First",
    description:
      "Not sure where to start with AI automation? These five workflows give you the fastest ROI with the least disruption.",
    publishedAt: "2026-02-03",
    tags: ["Automation", "SMB"],
  },
  {
    slug: "why-ai-agents-not-chatbots",
    title: "Why AI Agents, Not Chatbots, Are the Future of SMB Operations",
    description:
      "Chatbots answer questions. AI agents take action. Here's why that distinction matters for your business.",
    publishedAt: "2026-01-20",
    tags: ["AI Agents", "Operations"],
  },
  {
    slug: "build-vs-buy-ai-automation",
    title: "Build vs. Buy: How to Think About AI Automation for Your Business",
    description:
      "Should you build your own automations, use an off-the-shelf platform, or hire a team to build them for you? Here's a framework.",
    publishedAt: "2026-01-06",
    tags: ["Strategy", "AI Agents"],
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
              Thoughts on AI automation, agent workflows, and building more
              leveraged businesses.
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
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="mono">{tag}</Badge>
                      ))}
                    </div>
                    <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {post.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-6">
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="font-mono text-xs text-primary/60 group-hover:text-primary transition-colors">
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
                Ready to stop doing the work your agents could handle?
              </p>
            </FadeIn>
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
