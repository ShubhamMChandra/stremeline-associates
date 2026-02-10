# Stremeline Associates — Web

Marketing website for Stremeline Associates, an AI automation agency helping SMBs with lead capture, workflow automation, error reduction, and scaling operations.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5.9**
- **Tailwind CSS v4** (CSS-first config) + **Radix UI** + **CVA**
- **GSAP**, **Motion**, **Lenis** for animations & smooth scroll
- **React Hook Form** + **Zod** for forms
- **Resend** for transactional email
- **Vitest** + **Playwright** for testing

## Getting Started

From the **monorepo root**:

```bash
pnpm install
pnpm dev          # starts web app on http://localhost:3001
```

Or from `apps/web/`:

```bash
pnpm dev          # http://localhost:3001
pnpm build        # production build
pnpm lint         # ESLint (zero warnings)
pnpm check-types  # TypeScript type checking
pnpm test         # unit tests (Vitest)
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Home page (hero, problem scroll, capabilities, counter wall, use cases, CTA) |
| `/about` | About the agency |
| `/services` | Service listing |
| `/services/[slug]` | Service detail (lead-capture, workflow-automation, error-reduction, scaling-operations) |
| `/case-studies` | Case study listing |
| `/case-studies/[slug]` | Case study detail |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post |
| `/contact` | Contact form |

## API Routes

| Endpoint | Description |
|----------|-------------|
| `POST /api/contact` | Contact form submission (sends email via Resend) |
| `POST /api/newsletter` | Newsletter subscription |
| `GET /api/og` | Dynamic Open Graph image generation |

## Project Structure

```
apps/web/
  app/
    (marketing)/     # Route group for marketing pages
    api/             # API routes
    layout.tsx       # Root layout (fonts, metadata, analytics)
    page.tsx         # Home page
  src/components/
    home/            # Home page sections (hero, capabilities, etc.)
    layout/          # Header, footer, mobile nav
    ui/              # Scroll animation components
    aceternity/      # Premium animation components
    providers/       # Context providers (smooth scroll)
  scripts/audit/     # Lighthouse audit automation
  lib/               # Utilities & helpers
  public/            # Static assets
```

## Workspace Packages

This app imports from shared monorepo packages via `@repo/*`:

- `@repo/ui` — Button, Card, Input, Sheet, etc.
- `@repo/content` — Services, case studies, navigation data
- `@repo/types` — Shared TypeScript types
- `@repo/utils` — cn(), formatDate(), slugify(), createMetadata()
- `@repo/validation` — Zod schemas for contact & newsletter forms
- `@repo/animation` — Animation hooks & utilities
- `@repo/tokens` — Design tokens

## Deployment

Deployed on **Vercel**. Auto-deploys on push to `main`.

Build command (set in `vercel.json`):

```bash
cd ../.. && pnpm turbo build --filter=web
```

## Audit Scripts

```bash
pnpm audit:desktop     # Lighthouse desktop audit
pnpm audit:mobile      # Lighthouse mobile audit
pnpm audit:responsive  # Responsive breakpoint audit
pnpm audit:sections    # Section-by-section audit
pnpm audit:all         # Run desktop + mobile + responsive
```
