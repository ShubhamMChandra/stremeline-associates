import type { Service } from "@repo/types";

export const services: Service[] = [
  {
    slug: "lead-capture",
    title: "Automate What Comes In",
    description:
      "Leads, requests, applications — whatever enters your business gets captured, validated, and routed automatically. Nothing waits. Nothing slips.",
    longDescription:
      "Prospects expect instant responses. Our agents monitor intake channels around the clock — validating data, enriching it with context, and routing qualified leads to the right person in seconds. No more 12-hour lag between form fill and first touch.",
    icon: "zap",
    label: "// intake",
    useCases: ["lead-intake-qualification", "crm-data-hygiene", "customer-follow-ups"],
  },
  {
    slug: "workflow-automation",
    title: "Connect Your Tools Into One Flow",
    description:
      "Your team uses 10+ tools. Agents bridge them — syncing data, triggering actions, and eliminating the copy-paste between systems.",
    longDescription:
      "Most bottlenecks come from manual handoffs between systems. We build agent workflows that connect your CRM, project tools, and comms into automated chains. Work that took hours happens in minutes — no copy-paste, no missed steps.",
    icon: "workflow",
    label: "// orchestration",
    useCases: ["sales-ops-handoffs", "internal-alerts-reporting", "crm-data-hygiene"],
  },
  {
    slug: "error-reduction",
    title: "Clean Data, Fewer Mistakes",
    description:
      "Agents that validate, deduplicate, and enrich your data continuously — so decisions are based on what's actually true.",
    longDescription:
      "Bad data leads to bad decisions. Our agents run continuous checks — deduplicating records, filling gaps, flagging anomalies — so your CRM and reporting tools always reflect reality. Your team stops cleaning spreadsheets and starts acting on them.",
    icon: "shield-check",
    label: "// data-integrity",
    useCases: ["crm-data-hygiene", "internal-alerts-reporting", "lead-intake-qualification"],
  },
  {
    slug: "scaling-operations",
    title: "Scale Without Adding Headcount",
    description:
      "As volume grows, agents grow with it. More throughput, same team size. No hiring, no onboarding, no overhead.",
    longDescription:
      "Hiring is slow and expensive. AI agents let you handle more leads, more customers, and more reporting without adding people. Volume doubles, your team stays the same size, and nothing falls through.",
    icon: "trending-up",
    label: "// scale",
    useCases: ["sales-ops-handoffs", "customer-follow-ups", "internal-alerts-reporting"],
  },
];
