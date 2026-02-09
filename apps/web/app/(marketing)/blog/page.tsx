import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Code, Card, CardHeader, CardTitle, CardDescription, Badge } from "@repo/ui";
import { FadeIn, AnimateOnScroll } from "@repo/animation";

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
  return (
    <>
      <section className="py-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <FadeIn>
            <Code className="mb-4 block">// blog</Code>
            <Heading size="h1" as="h1">
              Insights
            </Heading>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Thoughts on AI automation, agent workflows, and building more
              leveraged businesses.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="pb-[clamp(4rem,3rem+5vw,8rem)]">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post, i) => (
              <AnimateOnScroll key={post.slug} delay={i * 0.1}>
                <Link href={`/blog/${post.slug}`}>
                  <Card className={`group h-full cursor-pointer transition-all hover:border-amber-500/20 ${post.featured ? "md:col-span-2" : ""}`}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="mono">{tag}</Badge>
                        ))}
                      </div>
                      <CardTitle className="text-xl group-hover:text-amber-500 transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardDescription>{post.description}</CardDescription>
                    <p className="mt-4 text-xs text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
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
