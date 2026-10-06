import type { Metadata } from "next";
import { Schibsted_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

/**
 * What this does: Root layout wrapping the entire application
 * Why it's here: Sets up fonts and site metadata
 * How it works: Server component rendering the HTML shell on a single paper ground, native scrolling
 * Dependencies: next/font/google, @vercel/analytics
 */

const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-schibsted",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex",
});

export const metadata: Metadata = {
  title: {
    default: "WAM | AI agents for growing operations teams",
    template: "%s | WAM",
  },
  description:
    "We design and deploy AI agent automations for small-to-medium businesses. Faster execution, fewer errors, systems that scale without adding headcount.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://wam.team",
  ),
  openGraph: {
    title: "WAM | AI agents for growing operations teams",
    description:
      "We design and deploy AI agents that take repetitive operations work off your team, inside the tools you already use.",
    siteName: "WAM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
