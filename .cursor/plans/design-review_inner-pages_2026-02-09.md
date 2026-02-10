---
date: 2026-02-09
time: 22:00 (24h, local)
prompt: "design quality agent can you take another pass on this? the non-homepage pages just look so shit in comparison to the really nice homepage"
scope: All inner pages — About, Services, Case Studies, Blog, Contact
---

## First Impressions

Reading the homepage vs the inner pages back-to-back, the quality gap is enormous. The homepage has:

- **Orchestrated entrance sequences** (clip-path headline reveal, terminal typing, staggered fade-ups)
- **Dark/light rhythm** — sections alternate between dark and light with gradient transitions
- **Typographic drama** — 15vw counter numbers, serif italic quotes, monospace labels
- **Ambient atmosphere** — gradient blobs, noise texture, subtle drift animation
- **Section format variety** — hero, horizontal scroll panels, card grid, counter wall, stacked peel cards, serif CTA. Six sections, six completely different formats.
- **Scroll-driven effects** — GSAP scrub for number counting, card assembly, text reveals
- **Interactive craft** — 3D card tilt, magnetic button cursor

Inner pages have:
- `pt-12 pb-6` hero with a heading and one paragraph
- Card grid
- Another card grid
- Maybe a CTA

It's like two different sites. The inner pages feel like a tutorial project. The homepage feels designed.

## The Core Problems

### 1. No atmosphere on any hero
Inner page heroes are 48px top padding, a heading, and some text. Zero visual presence. The homepage hero has gradient blobs, noise texture, and a full orchestrated entrance. Inner pages need their own (lighter) version of this atmosphere.

### 2. Wall of dark mode
Every section on every inner page is the same dark background. The homepage alternates dark → light → dark → light → dark with gradient transitions. Inner pages need this rhythm.

### 3. Same format repeated
Services page has TWO card grids in a row. About page has heading + card grid, heading + timeline (which also looks like a list), heading + quote. It's all the same density. Where are the moments of breath? Where's the visual variety?

### 4. No typographic drama
Homepage has 15vw numbers, serif italic quotes, monospace labels. Inner pages have uniformly-sized headings and body text. Nothing stops the scroll.

### 5. Thin spacing and no breathing room
`pt-12 pb-6` for heroes. `py-12` for sections. Compare to `pt-24 pb-12` and `py-20 md:py-32` on the homepage. The inner pages feel cramped.

## The Plan

### Global Pattern for Inner Page Heroes
Create a reusable hero pattern for inner pages:
- Generous padding (pt-24 pb-16 md:pt-32 md:pb-20)
- Ambient gradient blobs (subtler than homepage — one blob, smaller)
- Noise texture overlay
- Monospace label above the headline
- Larger heading with tighter tracking

### About Page
1. **Hero**: Full atmosphere. Monospace `// about` label. Bigger heading.
2. **Values**: Switch to LIGHT section. Use a different layout — three columns with large numbers or icons on top instead of cards.
3. **Process**: Keep on dark. But make the step numbers HUGE (like use-cases 01/02/03 treatment) with the content next to them. Give each step breathing room.
4. **Closing**: Serif italic treatment. Full-width. More padding. Like a mini version of the homepage CTA.

### Services Page
1. **Hero**: Full atmosphere. `// services` label.
2. **Capabilities**: LIGHT section. Keep the card grid but with 3D tilt on lead card, like homepage.
3. **Use Cases**: Back to DARK. Change from card grid to alternating rows with large numbers — like the homepage use-cases section.
4. **CTA**: Serif typographic treatment, not another card.

### Case Studies Page
1. **Hero**: Full atmosphere.
2. **Featured case study**: Instead of a card grid (there's only 1 case study), make it a full-width featured layout with results prominently displayed.
3. **CTA**: Invite visitors to contact for their own results.

### Blog Page
1. **Hero**: Full atmosphere.
2. **Featured post**: Large featured card spanning full width, not crammed into a grid.
3. **CTA**: Invite readers to subscribe or contact.

### Contact Page
1. **Add atmosphere** — gradient blobs behind the section.
2. **Better visual hierarchy** — the form side needs more drama.
3. **Serif line** — add a typographic moment before or after the form.

## Execution Log

### Pass 1: Visual quality (atmosphere, rhythm, interactions)
Done — gradient blobs, dark/light alternation, scroll-driven GSAP components.

### Pass 2: About page narrative review

Reading the About page as a visitor. The four sections are:
1. Hero: "A lean automation studio built by operators and engineers." + credential flex
2. "Our Principles" — Deep Technical Execution, Strong Business Judgment, Global Efficient Delivery
3. "Four Steps to Live" — Audit, Design, Build & Deploy, Optimize
4. Quote: "No bloated teams. No unnecessary platforms. Just automation that works."

**The problem:** These are four disconnected blocks with no narrative thread.

- The values are generic corporate abstractions. Who says they have SHALLOW technical execution? Every agency claims these.
- The process is the exact "Audit → Design → Build → Optimize" that the design agent's own guidelines flag as "Generic process rows that every agency has."
- There's no WHY. No origin story, no belief, no point of view. Nothing that tells me why this company exists or why it's different.
- No connective tissue. Each section starts fresh with a new heading. Nothing links the hero to the values, the values to the process, or the process to the closing.

**What an About page should do:** Tell a story. Answer: Why does this company exist? What gap did you see? Why are you the right people? What's different about how you think?

**New narrative arc:**
1. **Hero** — who we are (lean studio, strong credentials)
2. **The Belief** — WHY we exist. Prose, not bullets. The gap we saw: enterprise automation is too expensive for SMBs, DIY tools are too shallow, teams are stuck.
3. **What's Different** — not abstract values, but concrete differentiators: we build on your existing stack, we ship in weeks, we charge like a studio not a consultancy.
4. **How It Works** — brief process, subordinate. Supporting detail, not a main event.
5. **Closing** — tagline with weight.

Each section flows FROM the previous one. The belief sets up the differentiators. The differentiators set up the process. The process sets up the closing.
