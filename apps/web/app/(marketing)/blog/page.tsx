import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { PageIntro } from "../../../src/components/site/page-intro";
import { ClosingAsk } from "../../../src/components/site/closing-ask";
import { notes, paper } from "../../../src/components/site/paper";

/**
 * What this does: Insights index. Articles as paper cards
 * Why it's here: Content marketing and SEO: how we think about automation and operations
 * How it works: Server component; each card links to the article; the shared ask closes the page
 * Dependencies: @repo/ui, @repo/animation, site components
 */

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Our thinking on AI agent automation, operational efficiency, and how growing businesses can do more with less.",
};

const posts = [
  {
    slug: "five-workflows-to-automate-first",
    title: "The five workflows that yield the highest automation ROI",
    description:
      "Most companies automate the wrong thing first. After dozens of engagements, we keep seeing the same five workflows deliver 60–80% time savings within weeks, without disrupting how your team works.",
    publishedAt: "2026-02-03",
    readingTime: "7 min read",
    tags: ["Operations", "Automation"],
  },
  {
    slug: "why-ai-agents-not-chatbots",
    title: "Beyond chatbots: why autonomous AI agents are reshaping SMB operations",
    description:
      "Chatbots and AI agents are fundamentally different. Chatbots wait for someone to type. Agents watch your systems, make decisions, and execute on their own. If you don't have a dedicated ops team, that difference changes everything.",
    publishedAt: "2026-01-20",
    readingTime: "6 min read",
    tags: ["AI Agents", "Strategy"],
  },
  {
    slug: "build-vs-buy-ai-automation",
    title: "Build, buy, or partner: a decision framework for AI automation",
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
      <PageIntro
        title="Insights"
        lead="What we're learning about AI automation, operations design, and building companies that grow without drowning in manual work."
      />

      <section aria-label="Articles" className="pb-24 md:pb-32">
        <Container>
          <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
            {posts.map((post, i) => (
              <li key={post.slug}>
                <FadeIn delay={i * 0.06} className="h-full">
                  <Link
                    href={`/blog/${post.slug}`}
                    className={`group relative flex h-full flex-col p-6 pt-9 transition-transform duration-300 hover:-translate-y-0.5 md:p-7 md:pt-10 ${paper}`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-6 h-3 w-12 rounded-b-[3px] md:left-7"
                      style={{ background: notes[(i + 1) % notes.length] }}
                    />
                    <p className="text-[13px] text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      <span aria-hidden="true">&middot;</span> {post.readingTime}
                    </p>
                    <h2 className="mt-3 text-[20px] leading-snug font-semibold tracking-[-0.015em] group-hover:underline group-hover:decoration-foreground/30 group-hover:underline-offset-[5px]">
                      {post.title}
                    </h2>
                    <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-foreground/70">{post.description}</p>
                    <p className="mt-6 text-[13px] text-muted-foreground">{post.tags.join(", ")}</p>
                  </Link>
                </FadeIn>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ClosingAsk
        title="Automate the work that doesn't need judgment."
        lead="Protect the work that does. A 30-minute call is enough to find out which is which."
      />
    </>
  );
}
