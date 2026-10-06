import type { Metadata } from "next";
import Link from "next/link";
import { Container, Button } from "@repo/ui";
import { FadeIn } from "@repo/animation";

/**
 * What this does: Blog listing page with a plain hero and an editorial post list
 * Why it's here: Content marketing and SEO. Establishes WAM as thought leaders in AI automation
 * How it works: Server component on one paper ground. Posts render as a hairline-divided
 *   list (meta, title, summary), followed by a plain closing line and CTA.
 * Dependencies: @repo/ui, @repo/animation
 */

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Our thinking on AI agent automation, operational efficiency, and how growing businesses can do more with less.",
};

const posts = [
  {
    slug: "five-workflows-to-automate-first",
    title: "The Five Workflows That Yield the Highest Automation ROI",
    description:
      "Most companies automate the wrong thing first. After dozens of engagements, we keep seeing the same five workflows deliver 60–80% time savings within weeks, without disrupting how your team works.",
    publishedAt: "2026-02-03",
    readingTime: "7 min read",
    tags: ["Operations", "Automation"],
  },
  {
    slug: "why-ai-agents-not-chatbots",
    title: "Beyond Chatbots: Why Autonomous AI Agents Are Reshaping SMB Operations",
    description:
      "Chatbots and AI agents are fundamentally different. Chatbots wait for someone to type. Agents watch your systems, make decisions, and execute on their own. If you don't have a dedicated ops team, that difference changes everything.",
    publishedAt: "2026-01-20",
    readingTime: "6 min read",
    tags: ["AI Agents", "Strategy"],
  },
  {
    slug: "build-vs-buy-ai-automation",
    title: "Build, Buy, or Partner: A Decision Framework for AI Automation",
    description:
      "You can go DIY with no-code tools, buy a platform suite, or have custom agents built. Each path has real trade-offs in cost, flexibility, and reliability. Here's how to figure out which one actually fits.",
    publishedAt: "2026-01-06",
    readingTime: "8 min read",
    tags: ["Strategy", "Frameworks"],
  },
];

export default function BlogPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-16">
        <Container>
          <FadeIn>
            <h1 className="max-w-3xl text-[clamp(2.5rem,1.5rem+4vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-foreground">
              Insights
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              What we&apos;re learning about AI automation, operations design,
              and building companies that grow without drowning in manual work.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── All posts — hairline list ── */}
      <section className="py-20 md:py-28">
        <Container>
          <ul className="border-b border-border">
            {posts.map((post) => (
              <li key={post.slug} className="grid gap-3 border-t border-border py-8 md:grid-cols-[12rem_1fr] md:gap-12">
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                    <br />
                    {post.readingTime}
                  </p>
                  <div>
                    <h2 className="max-w-3xl text-2xl font-semibold tracking-[-0.03em] text-foreground">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                      {post.description}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {post.tags.join(", ")}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-4 inline-block text-sm font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                      Read the article
                    </Link>
                  </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn>
            <p className="max-w-2xl text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              The best teams automate the work that doesn&apos;t need judgment,
              and protect the work that does.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/contact">Schedule a diagnostic</Link>
            </Button>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
