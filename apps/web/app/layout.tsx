import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SmoothScrollProvider } from "../src/components/providers/smooth-scroll";
import "./globals.css";

/**
 * What this does: Root layout wrapping the entire application
 * Why it's here: Sets up fonts, metadata, theme script, and Lenis smooth scrolling
 * How it works: Server component that renders the HTML shell, with client-side providers
 * Dependencies: next/font/google, SmoothScrollProvider (Lenis)
 */

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Stremeline Associates — AI Agents for Leaner Operations",
    template: "%s | Stremeline Associates",
  },
  description:
    "We design and deploy AI agent automations for small-to-medium businesses. Faster execution, fewer errors, systems that scale without adding headcount.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://stremelineassociates.com",
  ),
  openGraph: {
    title: "Stremeline Associates — AI Agents for Leaner Operations",
    description:
      "We design and deploy AI agents that reduce manual overhead and simplify complex processes. Less busywork, fewer errors, operations that scale without adding headcount.",
    siteName: "Stremeline Associates",
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Inline script to prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.classList.add('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
