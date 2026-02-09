# Playwright Visual Audit Scripts

Quick Playwright scripts for automated visual testing. **Dev server must be running on port 3001.**

## Prerequisites

```bash
# Start dev server (in another terminal)
pnpm dev

# Install Playwright browsers (first time only)
npx playwright install chromium webkit
```

## Scripts

| Changed this... | Run this |
|---|---|
| Global CSS, colors, fonts | `pnpm audit:desktop` |
| Mobile layout | `pnpm audit:mobile` |
| Responsive breakpoints | `pnpm audit:responsive` |
| Individual sections | `pnpm audit:sections` |
| Any major change | `pnpm audit:diagnosis` |
| Everything | `pnpm audit:all` |

## Output

All screenshots go to `./audit-screenshots/` (gitignored).
