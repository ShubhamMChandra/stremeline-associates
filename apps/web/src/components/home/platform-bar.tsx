"use client";

import { Container } from "@repo/ui";
import { Marquee } from "@/components/ui/marquee";

const platforms = [
  "HubSpot",
  "Salesforce",
  "Slack",
  "Zapier",
  "Google Workspace",
  "Microsoft 365",
  "Notion",
  "Airtable",
  "Make",
  "n8n",
  "OpenAI",
  "Anthropic",
];

function PlatformPill({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-surface/50 px-5 py-2.5">
      <span className="text-sm font-medium text-muted-foreground">{name}</span>
    </div>
  );
}

export function PlatformBar() {
  return (
    <section className="border-y border-white/[0.04] py-8 overflow-hidden">
      <Container className="mb-4">
        <p className="text-center font-mono text-xs tracking-widest text-muted-foreground/60 uppercase">
          Integrates with your existing stack
        </p>
      </Container>
      <Marquee pauseOnHover className="[--duration:35s] [--gap:0.75rem]">
        {platforms.map((name) => (
          <PlatformPill key={name} name={name} />
        ))}
      </Marquee>
    </section>
  );
}
