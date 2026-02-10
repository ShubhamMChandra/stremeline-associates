import type { Service } from "@repo/types";

export const services: Service[] = [
  {
    slug: "lead-capture",
    title: "Lead Capture",
    description:
      "Leads, requests, applications — whatever enters your business gets captured, validated, and routed automatically. Nothing waits. Nothing slips.",
    longDescription:
      "Prospects expect instant responses. Our agents monitor intake channels around the clock — validating data, enriching it with context, and routing qualified leads to the right person in seconds. No more 12-hour lag between form fill and first touch.",
    icon: "zap",
    label: "// intake",
    useCases: ["lead-intake-qualification", "crm-data-hygiene", "customer-follow-ups"],
    problem:
      "Leads come in around the clock — web forms, emails, referrals — but your team only works business hours. By the time someone opens the CRM, the prospect has gone cold. Slow response times and inconsistent follow-up quietly bleed revenue every single week.",
    approach:
      "We deploy AI agents that monitor every intake channel in real time. The moment a lead arrives, it's validated, enriched with firmographic data, scored against your criteria, and routed to the right rep — all within seconds, not hours.",
    benefits: [
      "Sub-minute response times on every lead",
      "Automatic enrichment — company size, industry, tech stack",
      "Consistent qualification scoring, no matter who's on shift",
      "Zero manual data entry into your CRM",
    ],
    tools: ["HubSpot", "Salesforce", "Slack", "Gmail", "LinkedIn"],
    ctaLine:
      "Stop losing leads to lag time. Let agents handle the first five minutes.",
  },
  {
    slug: "workflow-automation",
    title: "Workflow Automation",
    description:
      "Your team uses 10+ tools. Agents bridge them — syncing data, triggering actions, and eliminating the copy-paste between systems.",
    longDescription:
      "Most bottlenecks come from manual handoffs between systems. We build agent workflows that connect your CRM, project tools, and comms into automated chains. Work that took hours happens in minutes — no copy-paste, no missed steps.",
    icon: "workflow",
    label: "// orchestration",
    useCases: ["sales-ops-handoffs", "internal-alerts-reporting", "crm-data-hygiene"],
    problem:
      "Your team switches between ten or more tools every day — copying data from the CRM to the project tracker, pasting updates into Slack, reconciling spreadsheets by hand. Every handoff is a chance for something to fall through the cracks.",
    approach:
      "We map your cross-system workflows end-to-end and build agent chains that handle the handoffs automatically. Data flows where it needs to go, actions trigger in sequence, and your team stops being the glue between disconnected tools.",
    benefits: [
      "Eliminate copy-paste between systems entirely",
      "Automated handoffs from sales to onboarding to delivery",
      "Real-time data sync across your entire tool stack",
      "Audit trails for every automated action",
    ],
    tools: ["Zapier", "Make", "Slack", "Notion", "Asana", "HubSpot"],
    ctaLine:
      "Your team has better things to do than move data between tabs.",
  },
  {
    slug: "error-reduction",
    title: "Error Reduction",
    description:
      "Agents that validate, deduplicate, and enrich your data continuously — so decisions are based on what's actually true.",
    longDescription:
      "Bad data leads to bad decisions. Our agents run continuous checks — deduplicating records, filling gaps, flagging anomalies — so your CRM and reporting tools always reflect reality. Your team stops cleaning spreadsheets and starts acting on them.",
    icon: "shield-check",
    label: "// data-integrity",
    useCases: ["crm-data-hygiene", "internal-alerts-reporting", "lead-intake-qualification"],
    problem:
      "Duplicate CRM records, missing fields, stale contacts, inconsistent formatting — bad data accumulates quietly until someone makes a decision based on numbers that aren't real. By then the damage is done.",
    approach:
      "We build agents that run continuous data quality checks across your systems — deduplicating records, filling gaps from external sources, flagging anomalies, and enforcing formatting standards. Your data stays clean without anyone manually auditing spreadsheets.",
    benefits: [
      "Continuous deduplication and merge across records",
      "Automatic enrichment from third-party data sources",
      "Real-time anomaly detection and alerting",
      "Clean reporting you can actually trust",
    ],
    tools: ["HubSpot", "Salesforce", "Google Sheets", "Airtable"],
    ctaLine:
      "Decisions are only as good as the data behind them. Make yours trustworthy.",
  },
  {
    slug: "scaling-operations",
    title: "Scale Operations",
    description:
      "As volume grows, agents grow with it. More throughput, same team size. No hiring. No onboarding. No overhead.",
    longDescription:
      "Hiring is slow and expensive. AI agents let you handle more leads, more customers, and more reporting without adding people. Volume doubles, your team stays the same size, and nothing falls through.",
    icon: "trending-up",
    label: "// scale",
    useCases: ["sales-ops-handoffs", "customer-follow-ups", "internal-alerts-reporting"],
    problem:
      "You're growing, but every new client means more manual work — more onboarding tasks, more follow-ups, more reporting. Hiring takes months and costs a fortune. In the meantime, things slip and quality drops.",
    approach:
      "We deploy agent systems that absorb the operational overhead of growth. More leads, more clients, more reporting — handled by agents that scale instantly. Your team stays focused on high-judgment work while throughput doubles.",
    benefits: [
      "Handle 2-3x volume with the same team size",
      "Instant scaling — no hiring, no onboarding lag",
      "Consistent quality at every volume level",
      "Free up senior staff for strategic work",
    ],
    tools: ["HubSpot", "Slack", "Notion", "QuickBooks"],
    ctaLine:
      "Growth shouldn't mean more busywork. Let agents absorb the overhead.",
  },
];
