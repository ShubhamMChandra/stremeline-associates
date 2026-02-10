---
name: V2 Visual Overhaul
overview: Consolidate the homepage from 7 same-weight sections to 5 visually distinct ones, sharpen the copy voice, replace heavyweight 3D with lighter OrbitingCircles, and strip scroll-driven gimmicks in favor of ambient motion + hover interactivity.
todos:
  - id: hero-rewrite
    content: "Rewrite Hero: 100vh, OrbitingCircles, social proof bar, grid overlay, parallax blobs, copy pass"
    status: completed
  - id: capabilities-upgrade
    content: "Upgrade Capabilities: LampEffect header, SpotlightCard wrapping, DotBackground, strip delays"
    status: completed
  - id: social-proof-create
    content: "Create Social Proof: compact process row + NumberTicker metrics + customer quote + Marquee"
    status: completed
  - id: use-cases-texture
    content: "Use Cases: add GridBackground, strip FadeIn delays"
    status: completed
  - id: cta-merge
    content: "Merge Unicorn + CTA: WordReveal headline, vision copy, NumberTicker stats, BorderBeam card"
    status: completed
  - id: page-composition
    content: Update page.tsx with new 5-section flow, delete 6 unused files
    status: completed
  - id: build-verify
    content: Build verification + mobile + hover + scroll test
    status: completed
isProject: false
---

# V2 Visual Overhaul

## The Problem

7 sections with identical rhythm (FadeIn + heading + cards + uniform padding). No drama, no tension, no release. The site has all the right components installed but the composition reads as "template assembled" not "designed with intent."

## New Section Flow (7 to 5)

```
BEFORE: Hero > Capabilities > Process > CustomerStory > UseCases > Unicorn > CTA
AFTER:  Hero > Capabilities > Social Proof > Use Cases > CTA
```

- Process + CustomerStory merge into **Social Proof** (both are credibility — one section)
- Unicorn + CTA merge into **CTA** (the vision should drive the action, not precede it)
- Hero3D + NodeVisualization replaced by **OrbitingCircles** (lighter, faster, works on mobile)

---

## Section-by-Section

### 1. HERO — rewrite [hero.tsx](apps/web/src/components/home/hero.tsx)

- Full `100vh` viewport ownership (from 90vh)
- Replace Hero3D/NodeVisualization with OrbitingCircles — loads instantly, works on all devices, shows on mobile (smaller radius)
- Keep BackgroundBeams, TextGenerateEffect, TypewriterEffect, shimmer CTA — all working great
- Add subtle CSS grid overlay (3% opacity, 60px spacing) for Linear/Vercel-style texture
- Add social proof stat bar below CTAs: `< 2 wks deploy | 0 dropped leads | 10x leverage` — earns trust before scroll
- Subtle parallax on gradient blobs via `useScroll` + `useTransform` (light touch, not a gimmick)
- **Copy pass**: Tighten subheadline voice — direct and unpretentious, match the footer tone

### 2. CAPABILITIES — modify [capabilities.tsx](apps/web/src/components/home/capabilities.tsx)

- Add LampEffect on section heading (dramatic reveal, gives this section its own visual identity) — with the caveat: if it reads "template," swap for a simpler gradient line reveal
- Wrap BentoCards in SpotlightCard for mouse-tracking amber glow on hover
- Add DotBackground as section bg layer — differentiates from hero visually
- Reduce top padding (LampEffect has built-in ~400px height)
- Keep BentoGrid layout, BorderBeam on lead card, Lucide icons
- **Strip FadeIn delays** — content just appears, no staggered waits

### 3. SOCIAL PROOF — create new [social-proof.tsx](apps/web/src/components/home/social-proof.tsx)

Merges Process + CustomerStory into one tight, data-dense section:

1. **Compact process row**: 4 icons horizontal with gradient connecting line (Search > PenTool > Rocket > BarChart3 with labels only — no descriptions, those live on /about)
2. **Metrics**: NumberTicker counters — Hours to Minutes, Zero dropped, Hours reclaimed
3. **Customer quote**: One condensed line from case study + "Read the full story" link
4. **Marquee**: Platform integration scroll (HubSpot, Salesforce, Zapier...)

No FadeIn delays. Content is visible on arrival.

### 4. USE CASES — minor edit [use-cases.tsx](apps/web/src/components/home/use-cases.tsx)

- Add GridBackground (line variant from dot-background.tsx) as section bg — differentiates from DotBackground in Capabilities
- Keep SpotlightCard hover, stagger animation, offset margins — this section is already solid
- **Strip FadeIn delays** on the section header

### 5. CTA — modify [cta-section.tsx](apps/web/src/components/home/cta-section.tsx)

Merges Unicorn + CTA into one emotional closer:

1. Unicorn headline: "The One-Person Unicorn Unlock." with WordReveal
2. Vision copy: "You don't need a bigger team. You need a smarter one."
3. NumberTicker stat row: 10x output | 40+ hours saved | Zero new hires — in a compact card
4. CTA card with BorderBeam: "Ready to automate?" + two buttons
5. Closing monospace line: "Most engagements launch in weeks, not months."

---

## Files to Delete

- [hero-3d.tsx](apps/web/src/components/home/hero-3d.tsx) — replaced by OrbitingCircles
- [node-visualization.tsx](apps/web/src/components/home/node-visualization.tsx) — no longer needed
- [unicorn-section.tsx](apps/web/src/components/home/unicorn-section.tsx) — merged into CTA
- [customer-story.tsx](apps/web/src/components/home/customer-story.tsx) — merged into Social Proof
- [process-section.tsx](apps/web/src/components/home/process-section.tsx) — condensed into Social Proof
- [use-gsap-scroll.ts](apps/web/src/hooks/use-gsap-scroll.ts) — unused GSAP hook, not needed

## Files to Update

- [page.tsx](apps/web/app/page.tsx) — new 5-section composition, remove deleted imports

## Cross-cutting

- **Copy voice**: Match the footer tone — "No bloated teams. Just automation that works." Direct, unpretentious. No corporate hedging.
- **FadeIn policy**: Hero sequence gets the cinematic stagger. Everything below the fold renders immediately — no artificial delays.
- **No new dependencies**: Pure composition pass using existing installed components.

## Verification

1. `pnpm --filter web build` — clean build, no type errors
2. All 5 sections render with distinct visual identities
3. Mobile (375px) — OrbitingCircles visible, no horizontal overflow
4. Hover test — SpotlightCard glow, BentoCard interactions
5. Smooth 60fps scroll with Lenis
