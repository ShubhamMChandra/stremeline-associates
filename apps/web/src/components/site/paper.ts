/**
 * What this does: Shared class strings for paper cards and quiet links
 * Why it's here: Keeps the white paper cards and underlined links identical across pages
 * How it works: Plain string constants composed into className props
 * Dependencies: none
 */

export const paper =
  "rounded-2xl bg-surface shadow-[0_1px_2px_rgba(60,45,10,0.06),0_18px_36px_-26px_rgba(60,45,10,0.35)]";

export const quietLink =
  "underline decoration-foreground/30 underline-offset-[5px] transition-colors hover:decoration-foreground";

/** Sticky-note colors, used as small tabs and the occasional note */
export const notes = ["#FFE9A8", "#CDE3F2", "#CFE6D2", "#F9D3DA", "#E3D8F3", "#FBD9BF"];
