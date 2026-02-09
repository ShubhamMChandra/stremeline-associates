import type { Service } from "@repo/types";

export const services: Service[] = [
  {
    slug: "lead-capture",
    title: "Capture and Act on Leads Instantly",
    description:
      "AI agents that capture, validate, and route leads in real-time — so no opportunity slips through the cracks.",
    longDescription:
      "Your prospects expect instant responses. Our AI agents monitor your intake channels 24/7, validate incoming data, enrich it with context, and route qualified leads to the right rep — all in seconds. No more manual data entry, no more delayed follow-ups, no more lost opportunities.",
    icon: "zap",
    label: "// lead-capture",
    useCases: ["lead-intake-qualification", "crm-data-hygiene", "customer-follow-ups"],
  },
  {
    slug: "workflow-automation",
    title: "Automate Internal Workflows End-to-End",
    description:
      "From intake to handoff, build workflows that run themselves — across your existing tools.",
    longDescription:
      "Most operational bottlenecks come from manual handoffs between systems and people. We design AI agent workflows that connect your CRM, project management, communication, and reporting tools into seamless automated chains. The result: work that used to take hours happens in minutes, without human intervention.",
    icon: "workflow",
    label: "// automation",
    useCases: ["sales-ops-handoffs", "internal-alerts-reporting", "crm-data-hygiene"],
  },
  {
    slug: "error-reduction",
    title: "Reduce Manual Work and Human Error",
    description:
      "Let agents handle the repetitive data tasks that drain your team and introduce mistakes.",
    longDescription:
      "Human error in data entry, validation, and reporting costs businesses thousands in lost productivity and bad decisions. Our AI agents take over the repetitive, detail-oriented tasks — validating data, checking for inconsistencies, flagging anomalies, and ensuring every record is accurate. Your team stops fixing mistakes and starts making decisions.",
    icon: "shield-check",
    label: "// precision",
    useCases: ["crm-data-hygiene", "internal-alerts-reporting", "lead-intake-qualification"],
  },
  {
    slug: "scaling-operations",
    title: "Scale Operations Without Hiring",
    description:
      "Grow your output without growing your headcount. AI agents that multiply your team's capacity.",
    longDescription:
      "Hiring is slow, expensive, and risky. AI agents let you scale operational capacity instantly — handling more leads, more customers, more reporting — without adding headcount. As your volume grows, your agents grow with it. No interviews, no onboarding, no overhead.",
    icon: "trending-up",
    label: "// scale",
    useCases: ["sales-ops-handoffs", "customer-follow-ups", "internal-alerts-reporting"],
  },
];
