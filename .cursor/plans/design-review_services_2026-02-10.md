---
date: 2026-02-10
time: 00:30 (24h, local)
prompt: "The user says the /services page has bad design. Audit and fix it."
scope: /services page
---

# Design Review — Services Page

## First Impressions

Opened the services page. Compared to the homepage. The gap is glaring.

The homepage feels authored — clip-path reveals, a living terminal, before/after cards, GSAP scatter-to-grid, massive scroll-driven counters at 15vw, serif italic crescendo CTA. Every section is a different format. There's rhythm, contrast, pacing.

The services page feels assembled from leftovers. Five sections, three of which are directly transplanted from the homepage:
- Capabilities section = same 2x2 card grid as homepage (with ScrollAssembly, but same cards)
- Stat band = the homepage counter wall but shrunk to text-3xl footnotes
- Use cases = identical numbered list as homepage
- CTA = same serif reveal pattern

There's no reason for a visitor to come to /services if they've seen the homepage.

## What's Wrong — Section by Section

### 1. Hero
Fine but flat. A heading, description, stat badges. No emotional hook. The homepage hero has a clip-path reveal and a live terminal. This is just... text. It works, but it doesn't arrest.

### 2. Capabilities (light, card grid)
**The big problem.** This is the SAME format as the homepage capabilities. Same 4 services, same card grid, same ScrollAssembly animation. The services page should go DEEPER on each service — not repeat the homepage summary cards. A card grid with 2-3 line descriptions doesn't do justice to a dedicated services page.

### 3. Stat Band (dark, thin strip)
The homepage CounterWall has numbers at `clamp(6rem, 15vw, 18rem)` — they're enormous, they're the design. The services stat band uses `text-3xl md:text-4xl` — the numbers are invisible. Same data, zero impact. It feels like a data table, not a proof moment.

### 4. Use Cases (light, numbered list)
Exact same content and format as the homepage UseCases component. Same numbered rows, same hover highlight. No differentiation.

### 5. CTA (dark, serif reveal)
Same ScrollTextReveal technique as homepage CTA. Different copy, but same visual pattern. Fine in isolation, problematic when the page is already borrowing 3 other homepage formats.

## Format Variety Failure

The page uses: text block → card grid → stat strip → numbered list → text block.

That's effectively: text, cards, text, list, text. Three text-dominant sections and two structured sections. No visual wow moment. No format diversity.

Compare homepage: hero with terminal → before/after comparison → scatter-to-grid cards → MASSIVE counters → numbered list → serif typography crescendo. Six distinct formats.

## What I'm Going to Build

### Narrative Strategy
The services page needs its OWN identity. Not a repeat of the homepage. The homepage says "here's what we do." The services page should say "here's EXACTLY what we do, and here's HOW."

**New content the homepage doesn't have: the process section.** The `processSteps` data (Audit → Design → Build → Optimize) exists in @repo/content but isn't used on the homepage. This is unique to /services.

### New Section Structure (5 sections, 5 formats)

1. **Hero (dark)** — Keep atmospheric blobs. Add serif italic accent phrase for emotional depth. Remove stat badges (they'll be proven in the stats section instead). Format: atmospheric text.

2. **Services Deep-Dive (light)** — Replace 2x2 card grid with full-width feature ROWS. Each service gets a full row: large ghost number (01-04), icon, monospace label, large title, longDescription paragraph. This is a spec sheet / feature page format — different from any homepage section. Format: full-width rows.

3. **How We Work (dark)** — NEW section. 4-column process grid. Each step: ghost number, monospace label, title, description. Border-left separators between columns. This content doesn't exist on the homepage. Format: horizontal grid.

4. **Proof Band (dark)** — Same 3 stats but at `clamp(3.5rem, 8vw, 7rem)` — much larger than current text-3xl, slightly smaller than homepage's 15vw (to avoid exact duplication). Serif brand quote below: "Zero lock-in. Your agents earn their place every month — or we haven't built them right." Format: large counters + pull quote.

5. **CTA (dark)** — Serif text reveal. Different copy: "Tell us where the bottlenecks are. We'll show you what agents can do." Format: typography + button.

### Color Rhythm
Dark → (gradient) → Light → (gradient) → Dark → Dark → Dark

The bottom three dark sections are distinct: process grid (dense, structured) → stats (sparse, large numbers) → CTA (sparse, typography). Density decreases toward the bottom — natural deceleration toward the action.

### What I'm Removing
- ScrollAssembly component (no more card grid)
- useCases import and entire use cases section (homepage already shows these)
- Stat badges from hero (proven later in stats section)

### What I'm Adding
- Serif italic emotional bridge in hero
- Full-width service feature rows with longDescription
- Process section (4 steps from @repo/content)
- Larger scroll-driven stats
- Serif brand quote
- Gradient transitions between dark/light zones

## Execution Log

### Changes Made

Rewrote the entire services page. Build passes. Screenshots verified at each scroll position.

**Section 1: Hero** — Kept atmospheric blobs. Removed stat badges (redundant with stats section below). Added serif italic emotional bridge: "Your team does the work that matters. Agents handle everything else." More breathing room at bottom.

**Section 2: Services Deep-Dive (light)** — Replaced 2x2 ScrollAssembly card grid with full-width feature ROWS. Each service now gets a full row with: large ghost number (01-04), amber icon, monospace label (// intake, // orchestration, etc.), large bold title (text-2xl/3xl), and the longDescription paragraph. This goes much deeper than the homepage capabilities section. Separated by border-t lines. Clean, editorial feel.

**Section 3: How We Work (dark)** — NEW section. 4-column grid showing the process steps (Audit → Design → Build & Deploy → Optimize). Each column has a ghost number, monospace label, title, and description. Border-left separators between columns on desktop. This content is unique to the services page — the homepage doesn't have a process section.

**Section 4: Proof Band (dark)** — Three large scroll-driven counters at `clamp(3.5rem, 8vw, 7rem)` — dramatically larger than the old `text-3xl`. Numbers: 50+ hours reclaimed, 90% fewer errors, 1 week to go live. Below: serif italic brand quote: "Zero lock-in. Your agents earn their place every month — or we haven't built them right."

**Section 5: CTA (dark)** — Serif text reveal with NEW copy (different from homepage): "Tell us where the bottlenecks are. We'll show you what agents can do." Amber "Book an Audit" button.

**Structural:** Added gradient transitions between dark/light zones (matching homepage pattern). Color rhythm: dark → light → dark (3 sections).

### What Was Removed
- ScrollAssembly component and import (no more card grid)
- useCases import and entire use cases section (was identical to homepage)
- Stat badges from hero (proven in stats section instead)

### Result Assessment
Five distinct visual formats. Each section looks different from the one before it. The page goes deeper than the homepage on services (longDescription) and adds unique content (process steps). Stats are impactful. Serif typography adds personality. No homepage patterns repeated.
