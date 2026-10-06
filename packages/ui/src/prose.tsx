import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

const Prose = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "prose max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-h2:text-2xl prose-h3:text-xl prose-p:text-foreground/80 prose-p:leading-relaxed prose-a:text-primary prose-a:underline prose-a:underline-offset-4 prose-a:decoration-primary/30 hover:prose-a:decoration-primary prose-strong:text-foreground prose-li:text-foreground/80 prose-li:leading-relaxed prose-code:text-primary prose-code:before:content-none prose-code:after:content-none prose-pre:bg-card prose-pre:border prose-pre:border-border prose-hr:border-border prose-ol:text-foreground/80 prose-ul:text-foreground/80 prose-table:text-muted-foreground prose-th:text-foreground prose-td:border-border prose-th:border-border prose-blockquote:border-l-2 prose-blockquote:border-marker prose-blockquote:bg-marker/[0.12] prose-blockquote:rounded-r-lg prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:font-normal prose-thead:border-b-2 prose-thead:border-foreground/20 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm prose-td:px-4 prose-td:py-3",
        className,
      )}
      {...props}
    />
  ),
);
Prose.displayName = "Prose";

export { Prose };
