import { type SVGAttributes } from "react";
import { cn } from "./cn";

interface LogoProps extends SVGAttributes<SVGSVGElement> {
  showText?: boolean;
}

function Logo({ className, showText = true, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <rect width="32" height="32" rx="8" fill="#D97706" />
        <path
          d="M8 16C8 11.582 11.582 8 16 8V8C20.418 8 24 11.582 24 16V16"
          stroke="#0A0A0B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="20" r="2" fill="#0A0A0B" />
        <circle cx="20" cy="20" r="2" fill="#0A0A0B" />
        <path d="M12 20H20" stroke="#0A0A0B" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {showText && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Stremeline<span className="text-amber-500">.</span>
        </span>
      )}
    </div>
  );
}

export { Logo };
