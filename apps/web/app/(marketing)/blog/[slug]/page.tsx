import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { Container, Prose, Button } from "@repo/ui";
import { FadeIn } from "@repo/animation";
import { ScrollProgress } from "../../../../src/components/ui/scroll-progress";

/**
 * What this does: Individual blog post page with an editorial article layout
 * Why it's here: Renders MDX blog content with proper typographic hierarchy and professional formatting
 * How it works: Reads MDX from filesystem, parses frontmatter, renders with marked. Plain header
 *   (back link, title, date/reading time/author/tags line), hairline divider, body, a hairline
 *   list of related posts, and a plain CTA footer. One paper ground throughout.
 * Dependencies: gray-matter, marked, @repo/ui, @repo/animation
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Estimate reading time at ~220 words per minute (professional/analytical content) */
function estimateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

function getBlogPost(slug: string) {
  const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data, content, slug };
}

function getBlogSlugs() {
  const dir = path.join(process.cwd(), "src/content/blog");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}

function getAllBlogPosts() {
  return getBlogSlugs()
    .map((s) => {
      const post = getBlogPost(s);
      if (!post) return null;
      return {
        slug: s,
        title: String(post.frontmatter.title || ""),
        readingTime: estimateReadingTime(post.content),
      };
    })
    .filter(Boolean) as { slug: string; title: string; readingTime: string }[];
}

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: String(post.frontmatter.title || ""),
    description: String(post.frontmatter.description || ""),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const tags = Array.isArray(post.frontmatter.tags)
    ? post.frontmatter.tags
    : [];
  const title = String(post.frontmatter.title || "");
  const publishedAt = String(post.frontmatter.publishedAt || "");
  const readingTime = estimateReadingTime(post.content);
  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== slug);

  return (
    <>
      <ScrollProgress />

      {/* ── Article header ── */}
      <section className="pt-16 pb-8 md:pt-20 md:pb-10">
        <Container className="max-w-3xl">
          <FadeIn>
            <Link
              href="/blog"
              className="mb-8 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; All posts
            </Link>

            <h1 className="text-[clamp(2.5rem,1.5rem+4vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-foreground">
              {title}
            </h1>

            {/* Byline: date, reading time, author, tags */}
            <p className="mt-6 text-sm text-muted-foreground">
              {publishedAt && (
                <>
                  <time dateTime={publishedAt}>
                    {new Date(publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  {" · "}
                </>
              )}
              {readingTime} · WAM
              {tags.length > 0 && <> · {tags.join(", ")}</>}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ── Article body ── */}
      <section className="pb-20 md:pb-28">
        <Container className="max-w-3xl">
          <div className="border-t border-border pt-10 md:pt-14">
            <Prose>
              <div
                dangerouslySetInnerHTML={{
                  __html: marked.parse(
                    /* Strip the H1 so the page title isn't duplicated */
                    post.content.replace(/^# .+$/m, ""),
                    { gfm: true, breaks: false },
                  ) as string,
                }}
              />
            </Prose>
          </div>
        </Container>
      </section>

      {/* ── Related posts ── */}
      {relatedPosts.length > 0 && (
        <section className="py-20 md:py-28">
          <Container className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-3xl">
              Continue reading
            </h2>
            <ul className="mt-8 border-b border-border">
              {relatedPosts.map((related) => (
                <li key={related.slug} className="border-t border-border py-6">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    <Link
                      href={`/blog/${related.slug}`}
                      className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                      {related.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {related.readingTime}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* ── CTA footer ── */}
      <section className="py-20 md:py-28">
        <Container className="max-w-3xl">
          <FadeIn>
            <p className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              Apply these insights to your operations.
            </p>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Schedule a 30-minute diagnostic. We&apos;ll map your workflows,
              spot the automation opportunities, and put together a deployment
              plan. No cost, no commitment.
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
