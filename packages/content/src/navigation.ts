import type { NavItem } from "@repo/types";

export const mainNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
];

export const footerNav = {
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
  services: [
    { label: "Lead Capture", href: "/services/lead-capture" },
    { label: "Workflow Automation", href: "/services/workflow-automation" },
    { label: "Error Reduction", href: "/services/error-reduction" },
    { label: "Scale Operations", href: "/services/scaling-operations" },
  ],
  resources: [
    { label: "Case Studies", href: "/case-studies" },
    { label: "Blog", href: "/blog" },
  ],
};

export const siteConfig = {
  name: "Streamline Associates",
  tagline: "AI agents that cut the manual work out of your operations.",
  description:
    "We design and deploy AI agents that reduce manual overhead and simplify complex processes. Less busywork, fewer errors, operations that scale without adding headcount.",
  url: "https://streamlineassociates.com",
  email: "hello@streamlineassociates.com",
};
