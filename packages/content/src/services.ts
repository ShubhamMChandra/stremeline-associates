import type { Service } from "@repo/types";

export const services: Service[] = [
  {
    slug: "lead-capture",
    title: "Automate What Comes In",
    description:
      "Leads, requests, applications — whatever enters your business gets captured, validated, and routed automatically. Nothing waits. Nothing slips.",
    longDescription:
      "Your prospects expect instant responses. Our AI agents monitor your intake channels 24/7, validate incoming data, enrich it with context, and route qualified leads to the right person — all in seconds. No more manual data entry, no more delayed follow-ups, no more lost opportunities.",
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
      "Most operational bottlenecks come from manual handoffs between systems and people. We design AI agent workflows that connect your CRM, project management, communication, and reporting tools into seamless automated chains. The result: work that used to take hours happens in minutes, without human intervention.",
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
      "Human error in data entry, validation, and reporting costs businesses thousands in lost productivity and bad decisions. Our AI agents take over the repetitive, detail-oriented tasks — validating data, checking for inconsistencies, flagging anomalies, and ensuring every record is accurate. Your team stops fixing mistakes and starts making decisions.",
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
      "Hiring is slow, expensive, and risky. AI agents let you scale operational capacity instantly — handling more leads, more customers, more reporting — without adding headcount. As your volume grows, your agents grow with it. No interviews, no onboarding, no overhead.",
    icon: "trending-up",
    label: "// scale",
    useCases: ["sales-ops-handoffs", "customer-follow-ups", "internal-alerts-reporting"],
  },
];
