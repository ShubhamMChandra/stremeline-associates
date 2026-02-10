import type { MetadataRoute } from "next";
import { services, caseStudies } from "@repo/content";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stremelineassociates.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/case-studies`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
  ];

  const servicePages = services.map((s) => ({
    url: `${BASE_URL}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const caseStudyPages = caseStudies.map((s) => ({
    url: `${BASE_URL}/case-studies/${s.slug}`,
    lastModified: new Date(s.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogDir = path.join(process.cwd(), "src/content/blog");
  const blogPages = fs.existsSync(blogDir)
    ? fs.readdirSync(blogDir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => {
          const raw = fs.readFileSync(path.join(blogDir, f), "utf-8");
          const { data } = matter(raw);
          const slug = f.replace(/\.mdx$/, "");
          return {
            url: `${BASE_URL}/blog/${slug}`,
            lastModified: new Date(String(data.publishedAt)),
            changeFrequency: "monthly" as const,
            priority: 0.6,
          };
        })
    : [];

  return [...staticPages, ...servicePages, ...caseStudyPages, ...blogPages];
}
