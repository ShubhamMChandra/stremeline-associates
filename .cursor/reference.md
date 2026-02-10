# Agent Quick-Reference — Stremeline Associates

Read this FIRST before doing any work. This is the full codebase map so you don't waste turns exploring.

---

## Project Overview

**Stremeline Associates** — AI automation agency website. Next.js 16, React 19, TypeScript 5.9, Tailwind CSS v4, pnpm Turbo monorepo.

- **Production:** https://stremeline-associates-sam-chands-projects.vercel.app
- **Repo:** https://github.com/ShubhamMChandra/stremeline-associates
- **Branch:** main (auto-deploys to Vercel on push)
- **Node:** >=18, pnpm@9.0.0

---

## Directory Structure

```
apps/
  web/                          # Main Next.js 16 app
    app/
      layout.tsx                # Root layout (fonts, metadata, SmoothScrollProvider)
      page.tsx                  # Homepage (Hero > Capabilities > SocialProof > UseCases > CTA)
      globals.css               # Design tokens, theme, custom utilities
      (marketing)/
        layout.tsx              # Wraps pages with Header + Footer
        about/page.tsx
        blog/page.tsx
        blog/[slug]/page.tsx
        case-studies/page.tsx
        case-studies/[slug]/page.tsx
        services/page.tsx
        services/[slug]/page.tsx
        contact/page.tsx
      api/
        contact/route.ts        # POST: form validation + Resend email + rate limiting
        newsletter/route.ts     # POST: email validation (placeholder integration)
        og/route.tsx            # GET: dynamic OG image generation (Edge)
    src/
      components/
        home/                   # Homepage sections (hero, capabilities, social-proof, use-cases, cta-section)
        layout/                 # header.tsx, footer.tsx, mobile-nav.tsx
        providers/              # smooth-scroll.tsx (Lenis + GSAP)
        shared/                 # Shared utility components
        ui/                     # Aceternity/Magic UI animated components
      content/
        blog/                   # MDX blog posts
    public/                     # Static assets (fonts, images)
    scripts/audit/              # Playwright responsive/performance audits

packages/
  ui/          (@repo/ui)             # Shared UI components
  utils/       (@repo/utils)          # Utility functions
  types/       (@repo/types)          # Shared TypeScript types
  content/     (@repo/content)        # Static content data
  validation/  (@repo/validation)     # Zod form schemas
  tokens/      (@repo/tokens)         # Design tokens
  animation/   (@repo/animation)      # Motion variants & hooks
  config-tailwind/  (@repo/config-tailwind)
  config-eslint/    (@repo/eslint-config)
  config-typescript/ (@repo/typescript-config)
```

---

## Package Exports (What You Can Import)

### @repo/ui
```
Button (variants: default, outline, ghost, link | sizes: sm, default, lg, icon)
Card, CardHeader, CardTitle, CardDescription, CardContent
Badge (variants: default, mono)
Input, Textarea, Label, Separator
Container, Section
Heading (sizes: h1-h6, as prop)
Prose, Logo, Code
Sheet, SheetTrigger, SheetClose, SheetContent
cn()
```

### @repo/utils
```
cn(inputs)              — Tailwind class merging (clsx + tailwind-merge)
formatDate(date)        — Localized date string
slugify(text)           — URL-safe slug
readingTime(text)       — "X min read" (200 wpm)
createMetadata()        — Page metadata helper
```

### @repo/types
```
# Content
Service       — slug, title, description, longDescription, icon, label, useCases[]
UseCase       — slug, title, description, icon, relatedServices[]
CaseStudy     — slug, title, client, industry, summary, problem, solution, results[], testimonial?, publishedAt
BlogPost      — slug, title, description, author, publishedAt, updatedAt?, tags[], image?, featured?
TeamMember    — name, role, bio, image?, credentials[]
ProcessStep   — number, title, description, label
Testimonial   — quote, author, role, company
NavItem       — label, href, children?[]

# API
ContactFormData, NewsletterData, ApiResponse

# Components
SectionProps, CardProps, AnimationProps
```

### @repo/content
```
services          — 4 services: lead-capture, workflow-automation, error-reduction, scaling-operations
useCases          — Use case objects
caseStudies       — Case study objects (currently 1)
team              — Team member data
processSteps      — Process workflow steps
mainNav           — Header nav items (About, Services, Case Studies, Blog)
footerNav         — Footer nav (company, services, resources)
siteConfig        — { name, tagline, description, url, email }
```

### @repo/validation
```
contactFormSchema    — name (2-100), email, company (1-200), service?, message (10-5000)
newsletterSchema     — email only
```

### @repo/animation
```
# Variants (for motion/react)
fadeUp, fadeIn, slideInLeft, slideInRight, scaleIn
staggerContainer, staggerItem
wordReveal, wordRevealChild

# Hooks
useReducedMotion()           — Respects prefers-reduced-motion
useScrollAnimation(threshold) — IntersectionObserver with ref + isInView
useMagneticCursor(strength)  — Mouse-following magnetic effect

# Components
AnimateOnScroll, FadeIn, WordReveal, StaggerChildren, StaggerItem, Counter
```

### @repo/tokens
```
colors, typography, spacing, container
duration, easing, springConfig, transition
```

---

## Design System

### Colors
| Token | Dark (default) | Light (.light class) |
|-------|---------------|---------------------|
| Background | #0A0A0B | #FAFAF9 |
| Foreground | #FAFAF9 | #0A0A0B |
| Primary | #D97706 (amber) | #D97706 |
| Secondary | #1A1A1D | — |
| Border | rgba(255,255,255,0.08) | — |

### Fonts
- **Sans:** Inter (--font-sans) — default
- **Mono:** JetBrains Mono (--font-mono) — code, labels
- **Serif:** Instrument Serif (--font-serif) — accent/display

### Custom CSS Utilities (globals.css)
- `.btn-glow` — Amber hover shadow
- `.card-lift` — Y translate + shadow on hover
- `.marquee-fade` — Edge fade mask
- `.link-draw` — Left-to-right underline on hover
- `.stat-glow` — Amber text shadow

### Radius
- Base: 0.625rem (~10px), variants: --radius-sm through --radius-2xl

---

## Key Patterns

### 1. Server Components by Default
Only add `"use client"` when using hooks, browser APIs, or event handlers.

### 2. Annotation Headers (Required)
All major files need this after imports:
```typescript
/**
 * What this does: [One-line description]
 * Why it's here: [What problem it solves]
 * How it works: [1-3 sentence explanation]
 * Dependencies: [Key packages/modules]
 */
```

### 3. CVA for Component Variants
```typescript
const variants = cva("base-classes", {
  variants: { variant: { default: "...", outline: "..." }, size: { sm: "...", default: "..." } },
  defaultVariants: { variant: "default", size: "default" },
});
// Usage: cn(variants({ variant, size, className }))
```

### 4. Tailwind v4 (CSS Config, No JS)
All theme config in globals.css `@theme inline`. No tailwind.config.js. Use `cn()` for class merging.

### 5. Form Validation
Zod schemas from @repo/validation. Server-side `safeParse()`, return field errors on failure.

### 6. Content as TypeScript
Services, case studies, use cases are typed arrays in @repo/content. Blog posts are MDX files in apps/web/src/content/blog/.

### 7. Animation
- motion/react for component animations
- @repo/animation variants for consistency
- Lenis + GSAP ScrollTrigger for scroll-driven effects (wrapped in SmoothScrollProvider)
- Always respect useReducedMotion()

---

## How To Do Common Tasks

### Add a New Page
1. Create `app/(marketing)/[name]/page.tsx` (server component)
2. Export metadata for SEO
3. Import UI from @repo/ui, animations from @repo/animation
4. Header/Footer come from (marketing) layout automatically

### Add a Component
1. Place in `apps/web/src/components/` with annotation header
2. If reusable across apps, add to `packages/ui/src/` and export from index.ts
3. Use CVA for variants, cn() for classes
4. Prefer server components

### Add Content
- **Blog:** Create .mdx in `apps/web/src/content/blog/[slug].mdx` with frontmatter
- **Service/Case Study:** Add to typed arrays in `packages/content/src/`
- **Types:** Define in `packages/types/src/content.ts`

### Style Something
- Use Tailwind classes (v4, CSS variable driven)
- Colors: bg-primary, text-muted-foreground, border-border, etc.
- Custom: add to globals.css @theme or @layer
- No separate CSS files

---

## Environment Variables
- `NEXT_PUBLIC_SITE_URL` — default: https://stremelineassociates.com
- `RESEND_API_KEY` — Email service
- `CONTACT_EMAIL` — Contact form inbox

## Commands
- `pnpm dev` — Dev server (port 3001)
- `pnpm build` — Build all
- `pnpm lint` — Lint (zero warnings)
- `pnpm check-types` — Typecheck
- `pnpm format` — Prettier
- `pnpm test` — Vitest

## Deployment
- Vercel, Root Directory: `apps/web`
- Build: `cd ../.. && pnpm turbo build --filter=web`
- Auto-deploys on push to main
