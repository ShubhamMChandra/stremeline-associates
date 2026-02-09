import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Container, Heading, Code, Prose, Badge, Button } from "@repo/ui";
import { FadeIn } from "@repo/animation";

interface PageProps {
  params: Promise<{ slug: string }>;
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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

  const tags = Array.isArray(post.frontmatter.tags) ? post.frontmatter.tags : [];
  const title = String(post.frontmatter.title || "");
  const publishedAt = String(post.frontmatter.publishedAt || "");

  return (
    <>
      <section className="py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container className="max-w-3xl">
          <FadeIn>
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; All Posts
            </Link>
            <div className="flex items-center gap-2 mb-4">
              {tags.map((tag: string) => (
                <Badge key={tag} variant="mono">{tag}</Badge>
              ))}
            </div>
            <Heading size="h1" as="h1">
              {title}
            </Heading>
            <p className="mt-4 text-sm text-muted-foreground">
              {publishedAt &&
                new Date(publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="pb-[clamp(4rem,3rem+5vw,8rem)]">
        <Container className="max-w-3xl">
          <Prose>
            {/* Render MDX content as HTML (simplified — full MDX rendering in production) */}
            <div dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/^# .+$/m, "")
                .replace(/^## (.+)$/gm, "<h2>$1</h2>")
                .replace(/^### (.+)$/gm, "<h3>$1</h3>")
                .replace(/^\*\*(.+?)\*\*/gm, "<strong>$1</strong>")
                .replace(/^- (.+)$/gm, "<li>$1</li>")
                .replace(/(<li>.*<\/li>\n?)+/gs, (match) => `<ul>${match}</ul>`)
                .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
                .replace(/\n{2,}/g, "</p><p>")
                .replace(/^(?!<[hulo])(.+)$/gm, "<p>$1</p>")
                .replace(/<p><\/p>/g, "")
                .replace(/---/g, "<hr />")
                .replace(/<p>\*(.+?)\*<\/p>/g, "<p><em>$1</em></p>")
            }} />
          </Prose>
        </Container>
      </section>

      <section className="border-t border-white/[0.06] py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container className="max-w-3xl">
          <FadeIn>
            <div className="text-center">
              <Heading size="h3" as="h2">
                Ready to automate your workflows?
              </Heading>
              <Button asChild size="lg" className="mt-6">
                <Link href="/contact">Book an Audit</Link>
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
