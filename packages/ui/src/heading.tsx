import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const headingVariants = cva("font-bold text-foreground", {
  variants: {
    size: {
      display:
        "text-[clamp(3.5rem,2rem+7.5vw,6rem)] leading-none tracking-[-0.03em]",
      h1: "text-[clamp(2.75rem,1.75rem+5vw,3.75rem)] leading-tight tracking-[-0.03em]",
      h2: "text-[clamp(1.875rem,1.5rem+1.875vw,2.25rem)] leading-tight tracking-[-0.02em]",
      h3: "text-[clamp(1.5rem,1.25rem+1.25vw,1.875rem)] leading-snug tracking-[-0.02em]",
      h4: "text-[clamp(1.125rem,1rem+0.5vw,1.25rem)] leading-snug",
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
