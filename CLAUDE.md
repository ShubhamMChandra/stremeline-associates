# CLAUDE.md — Project Instructions for Claude Code

## Project: Stremeline Associates

AI automation agency website built with Next.js 16, React 19, TypeScript, Tailwind v4, in a pnpm Turbo monorepo.

## File Annotation Rule

All MAJOR files (pages, layouts, components, hooks, utilities, API routes, types, schemas, content) must have an annotation header after imports:

```typescript
/**
 * What this does: [One-line description]
 * Why it's here: [What problem it solves or what part of the app needs it]
 * How it works: [Brief explanation — 1-3 sentences]
 * Dependencies: [Key packages or internal modules]
 */
```

Skip annotations for: barrel exports (index.ts), config files, trivial one-liners.

Keep each field to 1-2 lines. Be concise. When creating or substantially editing a major file, always add or update the annotation.

## Monorepo Structure

- `apps/web/` — Main Next.js 16 site (App Router)
- `packages/ui/` — Shared components (@repo/ui)
- `packages/tokens/` — Design tokens (@repo/tokens)
- `packages/types/` — Shared types (@repo/types)
- `packages/utils/` — Utilities like cn() (@repo/utils)
- `packages/validation/` — Zod form schemas (@repo/validation)
- `packages/content/` — Static content data (@repo/content)

## Key Conventions

- Server Components by default; `"use client"` only when needed.
- Tailwind v4 — config in CSS, not tailwind.config.js.
- Use `cn()` from `@repo/utils` for class merging.
- Strict TypeScript — no `any`.
- ESLint zero warnings policy.
- Import shared code via `@repo/*` workspace aliases.

## Deployment

- Hosted on **Vercel** — production URL: `stremeline-associates-sam-chands-projects.vercel.app`
- Vercel Root Directory is set to `apps/web`. The `vercel.json` lives in the repo root.
- Build command: `cd ../.. && pnpm turbo build --filter=web` (runs from `apps/web`, navigates to repo root for Turbo).
- Production deploys trigger on push to `main`.
- Deployment protection is off for production (publicly viewable); SSO protection is preview-only.

## Commands

- `pnpm dev` — Dev server
- `pnpm build` — Build all
- `pnpm lint` — Lint all
- `pnpm check-types` — Typecheck
- `pnpm format` — Prettier
