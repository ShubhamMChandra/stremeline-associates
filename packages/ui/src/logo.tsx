import { type HTMLAttributes } from "react";
import { cn } from "./cn";

/**
 * What this does: WAM wordmark, a wide lowercase "wam" with a highlighter stroke behind it
 * Why it's here: Brand mark used in the header, footer, and mobile nav
 * How it works: Text set in the site sans at its widest setting; the stroke is the same marker
 *   the site uses to show work an agent does
 * Dependencies: cn
 */

interface LogoProps extends HTMLAttributes<HTMLSpanElement> {
  showText?: boolean;
}

function Logo({ className, ...props }: LogoProps) {
  return (
    <span className={cn("relative inline-flex items-center", className)} {...props}>
      <span
        aria-hidden="true"
        className="absolute -inset-x-1 top-[38%] bottom-[8%] -rotate-[1.5deg] rounded-[2px] bg-marker"
      />
      <span className="relative text-[21px] leading-none font-[750] tracking-[-0.02em] text-foreground [font-stretch:125%]">
        wam
      </span>
    </span>
  );
}

export { Logo };
