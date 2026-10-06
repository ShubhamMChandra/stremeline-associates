import type { Metadata } from "next";
import { Mona_Sans, Newsreader, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

/**
 * What this does: Root layout wrapping the entire application
 * Why it's here: Sets up fonts and site metadata
 * How it works: Server component rendering the HTML shell. Mona Sans (with its width axis) for the
 *   site, Newsreader for documents shown on the page, native scrolling
 * Dependencies: next/font/google, @vercel/analytics
 */

const sans = Mona_Sans({
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
  variable: "--font-mona",
});

const serif = Newsreader({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-news",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex",
});

export const metadata: Metadata = {
  title: {
    default: "WAM | AI agents for operations teams",
    template: "%s | WAM",
  },
  description:
    "WAM builds AI agents for operations teams. We mark up your processes, find the work an agent can take, and build it inside the tools you already use.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://wam.team",
  ),
  openGraph: {
    title: "WAM | AI agents for operations teams",
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
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
