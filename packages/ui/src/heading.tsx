import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const headingVariants = cva("font-semibold text-foreground", {
  variants: {
    size: {
      /* Use named theme tokens (from base.css @theme) instead of raw clamp()
         so Tailwind's content scanner always generates the right classes */
      display: "text-display leading-none tracking-tighter",
      h1: "text-[clamp(2.5rem,1.5rem+4vw,4.5rem)] leading-[1.02] tracking-[-0.04em]",
      h2: "text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-[1.05] tracking-[-0.035em]",
      h3: "text-2xl leading-snug tracking-[-0.02em]",
      h4: "text-xl leading-snug",
    },
  },
  defaultVariants: {
    size: "h2",
  },
});

interface HeadingProps
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, as: Tag = "h2", ...props }, ref) => (
    <Tag ref={ref} className={cn(headingVariants({ size, className }))} {...props} />
  ),
);
Heading.displayName = "Heading";

export { Heading, headingVariants, type HeadingProps };
