import type { ProcessStep } from "@repo/types";

export const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: "Audit",
    description:
      "We identify bottlenecks and wasted effort across your operations — where your team spends time on work that should be automated.",
    label: "// audit",
  },
  {
    number: 2,
    title: "Design",
    description:
      "We architect agent workflows around your existing stack. No rip-and-replace — we build on what you already use.",
    label: "// design",
  },
  {
    number: 3,
    title: "Build & Deploy",
    description:
      "Fast, efficient deployment using no-code and low-code where possible. We get your agents live quickly.",
    label: "// deploy",
  },
  {
    number: 4,
    title: "Optimize",
    description:
      "As volume and complexity grow, we refine and improve your agent workflows — continuously making them smarter and faster.",
    label: "// optimize",
  },
];

export const processTagline = "Most engagements launch in weeks, not months.";
