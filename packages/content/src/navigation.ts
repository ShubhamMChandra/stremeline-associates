import type { NavItem } from "@repo/types";

export const mainNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Insights", href: "/blog" },
];

export const footerNav = {
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Insights", href: "/blog" },
  ],
  services: [
    { label: "Lead capture", href: "/services/lead-capture" },
    { label: "Workflow automation", href: "/services/workflow-automation" },
    { label: "Error reduction", href: "/services/error-reduction" },
    { label: "Scaling operations", href: "/services/scaling-operations" },
  ],
  resources: [
    { label: "Case studies", href: "/case-studies" },
    { label: "Insights", href: "/blog" },
  ],
};

export const siteConfig = {
  name: "WAM",
  tagline: "We build AI agents that take repetitive operations work off your team.",
  description:
    "We design and deploy AI agents that take repetitive operations work off your team, inside the tools you already use.",
  url: "https://wam.team",
  email: "hello@wam.team",
};
