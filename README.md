# Stremeline Associates

AI automation agency website built with Next.js 16, React 19, TypeScript, and Tailwind v4 in a pnpm Turborepo monorepo.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **Animation:** GSAP, Motion, Lenis
- **3D:** React Three Fiber / Drei
- **Forms:** React Hook Form + Zod
- **Email:** Resend + React Email
- **Monorepo:** Turborepo + pnpm

## Monorepo Structure

### Apps

| App | Description |
| --- | --- |
| `apps/web` | Main Next.js site |
| `apps/docs` | Documentation site |

### Packages

| Package | Alias | Description |
| --- | --- | --- |
| `packages/ui` | `@repo/ui` | Shared UI components |
| `packages/tokens` | `@repo/tokens` | Design tokens |
| `packages/types` | `@repo/types` | Shared TypeScript types |
| `packages/utils` | `@repo/utils` | Utilities (cn, helpers) |
| `packages/validation` | `@repo/validation` | Zod form schemas |
| `packages/content` | `@repo/content` | Static content data |
| `packages/animation` | `@repo/animation` | Animation utilities |
| `packages/api-client` | `@repo/api-client` | API client layer |
| `packages/config-eslint` | `@repo/eslint-config` | ESLint configuration |
| `packages/config-tailwind` | `@repo/config-tailwind` | Tailwind configuration |
| `packages/config-typescript` | `@repo/typescript-config` | TypeScript configuration |

## Prerequisites

- Node.js >= 18
- pnpm 9

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

The web app runs at `http://localhost:3001`.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all packages |
| `pnpm check-types` | Typecheck all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run Playwright e2e tests |
