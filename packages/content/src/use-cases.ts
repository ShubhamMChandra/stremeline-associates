import type { UseCase } from "@repo/types";

export const useCases: UseCase[] = [
  {
    slug: "lead-intake-qualification",
    title: "Leads Going Cold Overnight",
    description:
      "A lead fills out your form at 11pm. Without automation, nobody sees it until morning — and by then they've moved on. Agents validate, enrich, score, and route every lead the moment it arrives.",
    icon: "user-plus",
    relatedServices: ["lead-capture", "workflow-automation"],
  },
  {
    slug: "crm-data-hygiene",
    title: "CRM Data You Can't Trust",
    description:
      "Duplicate records. Stale contacts. Missing fields. Your team makes decisions on bad data every day. Agents clean and enrich your CRM continuously in the background — no manual audits needed.",
    icon: "database",
    relatedServices: ["error-reduction", "workflow-automation"],
  },
  {
    slug: "customer-follow-ups",
    title: "Follow-ups That Never Happen",
    description:
      "A prospect goes quiet for five days. Your rep is too busy to notice. An agent catches it, drafts a contextual follow-up, and sends it at the right time — automatically.",
    icon: "mail",
    relatedServices: ["lead-capture", "scaling-operations"],
  },
  {
    slug: "sales-ops-handoffs",
    title: "Dropped Handoffs Between Teams",
    description:
      "A deal closes, but onboarding stalls because someone forgot to create the project board. Agents handle the handoff — docs, boards, and notifications created within minutes of close.",
    icon: "arrow-right-left",
    relatedServices: ["workflow-automation", "scaling-operations"],
  },
  {
    slug: "internal-alerts-reporting",
    title: "Problems You Catch Too Late",
    description:
      "Pipeline dropped 20% this week and nobody flagged it until the Monday standup. Agents monitor the metrics that matter and surface issues the moment they appear.",
    icon: "bell",
    relatedServices: ["error-reduction", "scaling-operations"],
  },
];
