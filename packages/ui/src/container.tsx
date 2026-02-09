import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mx-auto w-full max-w-[1200px] px-6 md:px-8", className)}
      {...props}
    />
  ),
);
Container.displayName = "Container";

export { Container };
