export const duration = {
  fast: 150,
  base: 250,
  slow: 400,
  slower: 600,
  slowest: 1000,
} as const;

export const easing = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  outQuart: [0.25, 1, 0.5, 1] as const,
  inOutQuart: [0.76, 0, 0.24, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
};

export const springConfig = {
  gentle: { stiffness: 120, damping: 14, mass: 1 },
  snappy: { stiffness: 300, damping: 20, mass: 1 },
  bouncy: { stiffness: 400, damping: 10, mass: 1 },
  slow: { stiffness: 80, damping: 20, mass: 1 },
} as const;

export const transition = {
  fast: { duration: 0.15, ease: [0.16, 1, 0.3, 1] as const },
  base: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
  slow: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  slower: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  spring: { type: "spring" as const, stiffness: 300, damping: 20 },
} as const;
