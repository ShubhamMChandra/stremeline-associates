import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

const Prose = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "prose max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-li:text-muted-foreground prose-li:leading-relaxed prose-code:text-primary prose-code:before:content-none prose-code:after:content-none prose-pre:bg-card prose-pre:border prose-pre:border-border prose-hr:border-border prose-ol:text-muted-foreground prose-ul:text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
);
Prose.displayName = "Prose";

export { Prose };
