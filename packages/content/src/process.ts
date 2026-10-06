import type { ProcessStep } from "@repo/types";

export const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: "Audit",
    description:
      "We find where your team spends time on work that should be automated.",
    label: "// audit",
  },
  {
    number: 2,
    title: "Design",
    description:
      "We plan agent workflows around the stack you already have and build on what you use.",
    label: "// design",
  },
  {
    number: 3,
    title: "Build and deploy",
    description:
      "We use no-code and low-code where it fits, so agents go live quickly.",
    label: "// deploy",
  },
  {
    number: 4,
    title: "Optimize",
    description:
      "As volume grows, we keep tuning the agents on real work.",
    label: "// optimize",
  },
];

export const processTagline = "Most engagements launch within a few weeks.";
