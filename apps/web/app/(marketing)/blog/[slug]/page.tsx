import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { Container, Heading, Prose, Badge, Button } from "@repo/ui";
import { FadeIn } from "@repo/animation";

/**
 * What this does: Individual blog post page with McKinsey-style article layout
 * Why it's here: Renders MDX blog content with proper typographic hierarchy and professional formatting
 * How it works: Reads MDX from filesystem, parses frontmatter, renders with marked. Includes author
 *   attribution, reading time, tag badges, and a professional CTA footer.
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
    title: `${String(post.frontmatter.title || "")} | Stremeline Associates`,
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

  return (
    <>
      {/* ── Article Header ── */}
      <section className="pt-16 pb-8 md:pt-20 md:pb-10">
        <Container className="max-w-3xl">
          <FadeIn>
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-1 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              &larr; All Insights
            </Link>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              {tags.map((tag: string) => (
                <Badge key={tag} variant="mono">
                  {tag}
                </Badge>
              ))}
            </div>

            <Heading size="h1" as="h1">
              {title}
            </Heading>

            {/* Byline: date, reading time, author */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {publishedAt && (
                <time dateTime={publishedAt}>
                  {new Date(publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              )}
              <span className="text-muted-foreground/40">|</span>
              <span className="font-mono text-xs">{readingTime}</span>
              <span className="text-muted-foreground/40">|</span>
              <span>Stremeline Associates</span>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ── Divider ── */}
      <Container className="max-w-3xl">
        <div className="border-t border-border" />
      </Container>

      {/* ── Article Body ── */}
      <section className="py-10 md:py-14">
        <Container className="max-w-3xl">
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
        </Container>
      </section>

      {/* ── CTA Footer ── */}
      <section className="border-t border-border py-12 md:py-16">
        <Container className="max-w-3xl">
          <FadeIn>
            <div className="text-center">
              <Heading size="h3" as="h2">
                Apply these insights to your operations
              </Heading>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                Schedule a 30-minute diagnostic. We will map your workflows,
                identify automation opportunities, and outline a deployment
                plan — at no cost.
              </p>
              <Button asChild size="lg" className="btn-glow mt-8">
                <Link href="/contact">Schedule a Diagnostic</Link>
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
