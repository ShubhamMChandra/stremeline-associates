import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const headingVariants = cva("font-bold text-foreground", {
  variants: {
    size: {
      /* Use named theme tokens (from base.css @theme) instead of raw clamp()
         so Tailwind's content scanner always generates the right classes */
      display: "text-display leading-none tracking-tighter",
      h1: "text-6xl leading-tight tracking-tighter",
      h2: "text-5xl leading-tight tracking-tight",
      h3: "text-3xl leading-snug tracking-tight",
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
