import type { CaseStudy } from "@repo/types";

export const caseStudies: CaseStudy[] = [
  {
    slug: "b2b-software-lead-automation",
    title: "How a B2B Software Company Automated Their Entire Lead Pipeline",
    client: "B2B Software Company",
    industry: "SaaS / B2B Technology",
    summary:
      "A growing B2B software company eliminated manual lead handling, cut response times from hours to minutes, and scaled without adding headcount.",
    problem:
      "A growing B2B software company was struggling with manual lead handling. Response times were inconsistent — sometimes hours, sometimes days. Lead data was messy, with duplicates and missing fields. Sales reps were spending more time on admin work than selling. Leads were falling through the cracks, and the team couldn't scale without hiring more people.",
    solution:
      "We built an AI agent workflow that transformed their lead pipeline end-to-end. Real-time lead capture from web forms, email, and partner channels. Automatic data validation and enrichment — cleaning, deduplicating, and filling in missing company data. Instant routing to the right sales rep based on territory, deal size, and product interest. Automatic activity logging so every touchpoint was tracked without manual entry.",
    results: [
      {
        metric: "Lead response time",
        before: "4+ hrs",
        after: "Under 5 min",
        description: "Average lead response time dropped from over four hours to under five minutes.",
      },
      {
        metric: "Leads dropped",
        before: "~15%",
        after: "0%",
        description: "Every inquiry is now captured and routed — nothing falls through the cracks.",
      },
      {
        metric: "Admin time saved per rep",
        after: "12 hrs/week",
        description: "Each rep reclaimed roughly 12 hours a week previously spent on data entry.",
      },
      {
        metric: "Headcount added",
        after: "0",
        description: "Lead volume doubled with zero new hires — the system scales on its own.",
      },
    ],
    publishedAt: "2025-01-15",
  },
];
