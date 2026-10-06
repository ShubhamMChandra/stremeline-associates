import { type SVGAttributes } from "react";
import { cn } from "./cn";

/**
 * What this does: WAM wordmark with the signal square
 * Why it's here: Brand mark used in header, footer, and mobile nav
 * How it works: Lowercase wordmark set in the site sans; the square is the same mark the
 *   workflow map uses for "an agent runs this step"
 * Dependencies: cn
 */

interface LogoProps extends SVGAttributes<SVGSVGElement> {
  showText?: boolean;
}

function Logo({ className, showText = true, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" {...props}>
        <rect width="12" height="12" fill="var(--signal, #E5481F)" />
      </svg>
      {showText && (
        <span className="text-[22px] leading-none font-semibold tracking-[-0.05em] text-foreground">
          wam
        </span>
      )}
    </div>
  );
}

export { Logo };
