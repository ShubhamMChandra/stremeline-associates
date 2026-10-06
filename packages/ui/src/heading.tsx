import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const headingVariants = cva("font-semibold text-foreground", {
  variants: {
    size: {
      /* Use named theme tokens (from base.css @theme) instead of raw clamp()
         so Tailwind's content scanner always generates the right classes */
      display: "text-display leading-none tracking-tighter",
      h1: "text-[clamp(2.25rem,1.6rem+2.2vw,3.5rem)] leading-[1.06] tracking-[-0.015em] font-medium [font-stretch:112%]",
      h2: "text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] leading-[1.1] tracking-[-0.01em] font-medium [font-stretch:112%]",
      h3: "text-xl leading-snug font-medium [font-stretch:106%]",
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
