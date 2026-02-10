import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { Container, Heading, Prose, Badge, Button } from "@repo/ui";
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
      <section className="py-16 md:py-24">
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

      <section className="pb-16 md:pb-24">
        <Container className="max-w-3xl">
          <Prose>
            <div dangerouslySetInnerHTML={{
              __html: marked.parse(
                /* Strip the H1 so the page title isn't duplicated */
                post.content.replace(/^# .+$/m, ""),
                { gfm: true, breaks: false }
              ) as string
            }} />
          </Prose>
        </Container>
      </section>

      <section className="border-t border-border py-16 md:py-24">
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
