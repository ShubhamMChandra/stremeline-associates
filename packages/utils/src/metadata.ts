import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stremelineassociates.com";
const SITE_NAME = "Stremeline Associates";

interface MetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}

export function createMetadata({
  title,
  description,
  path = "",
  image,
  type = "website",
}: MetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}
