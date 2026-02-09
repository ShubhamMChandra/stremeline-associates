export const fontFamily = {
  sans: '"Inter Variable", "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace',
} as const;

export const fontSize = {
  xs: "clamp(0.75rem, 0.7rem + 0.15vw, 0.8125rem)",
  sm: "clamp(0.8125rem, 0.775rem + 0.2vw, 0.875rem)",
  base: "clamp(0.875rem, 0.825rem + 0.25vw, 1rem)",
  lg: "clamp(1rem, 0.925rem + 0.35vw, 1.125rem)",
  xl: "clamp(1.125rem, 1rem + 0.5vw, 1.25rem)",
  "2xl": "clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)",
  "3xl": "clamp(1.5rem, 1.25rem + 1.25vw, 1.875rem)",
  "4xl": "clamp(1.875rem, 1.5rem + 1.875vw, 2.25rem)",
  "5xl": "clamp(2.25rem, 1.5rem + 3.75vw, 3rem)",
  "6xl": "clamp(2.75rem, 1.75rem + 5vw, 3.75rem)",
  "7xl": "clamp(3rem, 1.75rem + 6.25vw, 4.5rem)",
  display: "clamp(3.5rem, 2rem + 7.5vw, 6rem)",
} as const;

export const fontWeight = {
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const letterSpacing = {
  tighter: "-0.03em",
  tight: "-0.02em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
} as const;

export const lineHeight = {
  none: "1",
  tight: "1.1",
  snug: "1.25",
  normal: "1.5",
  relaxed: "1.625",
} as const;
