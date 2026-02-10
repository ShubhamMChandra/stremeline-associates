import { type HTMLAttributes } from "react";
import { cn } from "./cn";

function Code({ children, className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn("font-mono text-xs text-muted-foreground tracking-wider", className)}
      {...props}
    >
      {children}
    </code>
  );
}

export { Code };
