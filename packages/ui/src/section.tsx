import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

const Section = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("py-[clamp(4rem,3rem+5vw,8rem)]", className)}
      {...props}
    />
  ),
);
Section.displayName = "Section";

export { Section };
