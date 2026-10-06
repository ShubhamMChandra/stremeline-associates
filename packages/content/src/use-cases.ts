import type { UseCase } from "@repo/types";

export const useCases: UseCase[] = [
  {
    slug: "lead-intake-qualification",
    title: "Leads going cold overnight",
    description:
      "A lead fills out your form at 11pm. Without automation, nobody sees it until morning, and by then they've moved on. Agents validate, enrich, score, and route every lead the moment it arrives.",
    icon: "user-plus",
    relatedServices: ["lead-capture", "workflow-automation"],
  },
  {
    slug: "crm-data-hygiene",
    title: "CRM data you can't trust",
    description:
      "Duplicate records. Stale contacts. Missing fields. Your team makes decisions on bad data every day. Agents clean and enrich your CRM in the background, so nobody has to audit it by hand.",
    icon: "database",
    relatedServices: ["error-reduction", "workflow-automation"],
  },
  {
    slug: "customer-follow-ups",
    title: "Follow-ups that never happen",
    description:
      "A prospect goes quiet for five days. Your rep is too busy to notice. An agent notices, drafts a follow-up with context, and sends it at the right time.",
    icon: "mail",
    relatedServices: ["lead-capture", "scaling-operations"],
  },
  {
    slug: "sales-ops-handoffs",
    title: "Dropped handoffs between teams",
    description:
      "A deal closes, but onboarding stalls because someone forgot to create the project board. Agents handle the handoff: docs, boards, and notifications are ready within minutes of close.",
    icon: "arrow-right-left",
    relatedServices: ["workflow-automation", "scaling-operations"],
  },
  {
    slug: "internal-alerts-reporting",
    title: "Problems you catch too late",
    description:
      "Pipeline dropped 20% this week and nobody flagged it until the Monday standup. Agents monitor the metrics that matter and surface issues the moment they appear.",
    icon: "bell",
    relatedServices: ["error-reduction", "scaling-operations"],
  },
];
