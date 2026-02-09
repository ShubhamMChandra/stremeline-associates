import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

const Prose = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-amber-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-amber-400 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-surface prose-pre:border prose-pre:border-white/[0.06]",
        className,
      )}
      {...props}
    />
  ),
);
Prose.displayName = "Prose";

export { Prose };
