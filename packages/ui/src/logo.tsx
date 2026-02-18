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
        <rect width="32" height="32" rx="8" fill="#0A0A0B" />
        {/* Comic starburst */}
        <path
          d="M16 2L18.5 8.5L23 6.5L22.5 11.5L29 12L24 16L28.5 20L22.5 21L23.5 26.5L18 23L16 30L13.5 23.5L9 25.5L9.5 21L3.5 20L9 16L3 12L9.5 11.5L8.5 5.5L14 9.5Z"
          fill="#D97706"
        />
        {/* WAM! text */}
        <text
          x="16"
          y="17"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="8"
          fontWeight="900"
          fontFamily="Impact, 'Arial Black', sans-serif"
          fill="#0A0A0B"
          fontStyle="italic"
        >
          WAM!
        </text>
      </svg>
      {showText && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          WAM<span className="text-primary">.</span>
        </span>
      )}
    </div>
  );
}

export { Logo };
