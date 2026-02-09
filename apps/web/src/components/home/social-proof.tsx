"use client";

import Link from "next/link";
import { Container, Heading, Button } from "@repo/ui";
import { caseStudies } from "@repo/content";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Marquee } from "@/components/ui/marquee";
import { Search, PenTool, Rocket, BarChart3 } from "lucide-react";

/**
 * What this does: Compact social proof section — process steps, metrics, customer quote, platform marquee
 * Why it's here: Credibility at a glance — merges process + customer story into one data-dense band
 * How it works: Horizontal process row, NumberTicker stats, customer quote, full-width Marquee
 * Dependencies: @repo/ui, @repo/content, Magic UI (NumberTicker, Marquee), lucide-react
 */

const techPlatforms = [
  "HubSpot",
  "Salesforce",
  "Zapier",
  "Make",
  "Slack",
  "Google Sheets",
  "Airtable",
  "Notion",
  "Monday.com",
  "Pipedrive",
  "Intercom",
  "Zendesk",
  "Stripe",
  "QuickBooks",
  "Mailchimp",
];

export function SocialProof() {
  const story = caseStudies[0];

  return (
    <section
      id="social-proof"
      className="relative pb-[clamp(3rem,2rem+3vw,5rem)] pt-[clamp(2rem,1.5rem+2vw,3.5rem)]"
    >
      {/* Slightly elevated background */}
      <div className="absolute inset-0 bg-surface/30" />

      <div className="relative z-10">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* 1. Process row — horizontal on desktop, 2×2 on mobile */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[Search, PenTool, Rocket, BarChart3].map((Icon, i) => {
                const labels = ["Audit", "Design", "Build", "Optimize"];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 sm:gap-6"
                  >
                    <div className="group flex flex-col items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/30 bg-surface text-amber-500 transition-all group-hover:border-amber-500/60 group-hover:shadow-[0_0_12px_rgba(217,119,6,0.15)] sm:h-12 sm:w-12">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {labels[i]}
                      </span>
                    </div>
                    {i < 3 && (
                      <div className="hidden h-px w-8 bg-gradient-to-r from-amber-500/40 to-amber-500/10 sm:block" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* 2. Metrics — anchored to operational efficiency */}
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
              <div className="text-center">
                <dt className="sr-only">Manual work eliminated per week</dt>
                <dd className="text-2xl font-bold text-amber-400 sm:text-3xl" aria-label="40 plus hours">
                  <NumberTicker value={40} className="text-amber-400" />
                  <span>+ hrs</span>
                </dd>
                <dd className="mt-1 text-xs text-muted-foreground">
                  Manual work eliminated per week
                </dd>
              </div>
              <div className="text-center">
                <dt className="sr-only">Fewer steps per process</dt>
                <dd className="text-2xl font-bold text-amber-400 sm:text-3xl" aria-label="3 times fewer">
                  <NumberTicker value={3} className="text-amber-400" />
                  <span>×</span>
                </dd>
                <dd className="mt-1 text-xs text-muted-foreground">
                  Fewer steps per process
                </dd>
              </div>
              <div className="text-center">
                <dt className="sr-only">Process consolidation</dt>
                <dd className="text-2xl font-bold text-amber-400 sm:text-3xl" aria-label="12 tools consolidated into 1 agent">
                  <span className="text-lg text-muted-foreground line-through">
                    12 tools
                  </span>
                  {" → "}
                  <span>1 agent</span>
                </dd>
                <dd className="mt-1 text-xs text-muted-foreground">
                  Process consolidation
                </dd>
              </div>
            </dl>

            {/* 3. Customer quote */}
            <div className="mt-8 border-t border-white/[0.06] pt-6 text-center">
              <p className="mx-auto max-w-xl text-sm leading-relaxed italic text-muted-foreground">
                &ldquo;We had 12 people doing what one agent does now. The
                overhead just… vanished.&rdquo;
              </p>
              <p className="mt-2 text-xs text-amber-500/80">
                — {story?.client ?? "B2B Software Company"}
              </p>
              <Button
                asChild
                variant="link"
                size="sm"
                className="mt-2 text-xs text-muted-foreground"
              >
                <Link
                  href={`/case-studies/${story?.slug ?? "b2b-software-lead-automation"}`}
                >
                  Read the full story →
                </Link>
              </Button>
            </div>
          </div>
        </Container>

        {/* 4. Platform marquee — full bleed */}
        <div className="mt-8 border-t border-white/[0.04] pt-6">
          <Container>
            <p className="mb-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
              // integrates with
            </p>
          </Container>
          <Marquee pauseOnHover className="[--duration:30s] [--gap:3rem]" aria-label="Platforms we integrate with">
            {techPlatforms.map((platform) => (
              <span
                key={platform}
                className="text-sm font-medium text-gray-500 transition-colors hover:text-foreground"
              >
                {platform}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
