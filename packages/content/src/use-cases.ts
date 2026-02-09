import type { UseCase } from "@repo/types";

export const useCases: UseCase[] = [
  {
    slug: "lead-intake-qualification",
    title: "Lead Intake and Qualification",
    description:
      "A lead fills out your form at 11pm. By morning, it's validated, enriched, scored, and assigned to the right rep — no human touched it.",
    icon: "user-plus",
    relatedServices: ["lead-capture", "workflow-automation"],
  },
  {
    slug: "crm-data-hygiene",
    title: "CRM Updates and Data Hygiene",
    description:
      "Duplicate records, stale contacts, missing fields — agents clean it all in the background so your CRM is always decision-ready.",
    icon: "database",
    relatedServices: ["error-reduction", "workflow-automation"],
  },
  {
    slug: "customer-follow-ups",
    title: "Customer and Prospect Follow-ups",
    description:
      "A prospect goes quiet for 5 days. An agent notices, drafts a contextual follow-up, and sends it at the right time — automatically.",
    icon: "mail",
    relatedServices: ["lead-capture", "scaling-operations"],
  },
  {
    slug: "sales-ops-handoffs",
    title: "Sales-to-Ops Handoffs",
    description:
      "A deal closes. Within minutes, the onboarding doc is created, the project board is set up, and the delivery team is notified.",
    icon: "arrow-right-left",
    relatedServices: ["workflow-automation", "scaling-operations"],
  },
  {
    slug: "internal-alerts-reporting",
    title: "Internal Alerts and Reporting",
    description:
      "Pipeline dropped 20% this week. An agent catches it, compiles the context, and pings your Slack before Monday's standup.",
    icon: "bell",
    relatedServices: ["error-reduction", "scaling-operations"],
  },
];
