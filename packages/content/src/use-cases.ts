import type { UseCase } from "@repo/types";

export const useCases: UseCase[] = [
  {
    slug: "lead-intake-qualification",
    title: "Lead Intake and Qualification",
    description:
      "Automatically capture leads from any channel, validate their data, score them, and route qualified prospects to the right rep — instantly.",
    icon: "user-plus",
    relatedServices: ["lead-capture", "workflow-automation"],
  },
  {
    slug: "crm-data-hygiene",
    title: "CRM Updates and Data Hygiene",
    description:
      "Keep your CRM clean and current with agents that validate entries, deduplicate records, enrich contact data, and flag inconsistencies.",
    icon: "database",
    relatedServices: ["error-reduction", "workflow-automation"],
  },
  {
    slug: "customer-follow-ups",
    title: "Customer and Prospect Follow-ups",
    description:
      "Never miss a follow-up. Agents trigger personalized outreach based on activity, timing, and engagement signals.",
    icon: "mail",
    relatedServices: ["lead-capture", "scaling-operations"],
  },
  {
    slug: "sales-ops-handoffs",
    title: "Sales and Ops Handoffs",
    description:
      "Automate the transition from closed deal to delivery. Agents sync data, create tasks, notify teams, and kick off onboarding flows.",
    icon: "arrow-right-left",
    relatedServices: ["workflow-automation", "scaling-operations"],
  },
  {
    slug: "internal-alerts-reporting",
    title: "Internal Alerts and Reporting",
    description:
      "Get real-time alerts on metrics that matter. Agents compile reports, flag anomalies, and keep your team informed without manual effort.",
    icon: "bell",
    relatedServices: ["error-reduction", "scaling-operations"],
  },
];
