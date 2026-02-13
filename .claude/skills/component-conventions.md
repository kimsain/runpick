---
name: component-conventions
description: Use when creating new components or pages. Covers Server/Client split, naming, file structure, and styling conventions.
---

# Component Conventions

## Server / Client Split

| Type | Pattern | Example |
|------|---------|---------|
| Server Component | `page.tsx` (route pages) | `src/app/shoe/[shoeId]/page.tsx` |
| Client Component | `*Client.tsx` suffix | `ShoeDetailClient.tsx`, `BrandPageClient.tsx` |
| Shared Component | No suffix, `'use client'` directive | `ShoeCard.tsx`, `Badge.tsx` |
| Layout | Server `layout.tsx` + Client `LayoutClient.tsx` | Root layout pattern |

Server components handle: metadata, static params, data fetching (from JSON).
Client components handle: animations, interactivity, hooks.

## File Organization

```
src/components/
  common/     — Reusable UI (Badge, Button, LoadingSpinner, PageTransition)
  effects/    — Visual effects (GrainOverlay, ImageDistortion, TextReveal, etc.)
  hero/       — Home page sections (HeroSection, CategoryNav, FeaturedShoes, QuizCTA)
  layout/     — App-wide layout (Header, Footer, LayoutClient, SmoothScroll, CustomCursor)
  quiz/       — Quiz feature (QuizQuestion, QuizResult, QuizProgress)
  shoe/       — Shoe display (ShoeCard, ShoeSpecChart)
```

## Naming Conventions

- Components: PascalCase (`ShoeCard.tsx`)
- Client wrappers: `*Client.tsx` suffix
- Hooks: `use*.ts` in `src/hooks/`
- Utils: camelCase in `src/utils/`
- Data: `src/data/` (JSON + TS definitions)
- Types: `src/types/` (interfaces only)

## Styling

- Tailwind CSS 4 with `@theme` custom properties in `globals.css`
- Color tokens: `var(--color-*)` — never hardcode colors
- ASICS brand: `--color-asics-blue` (#003DA5), `--color-asics-accent` (#00D1FF)
- Category colors: `--color-daily` (green), `--color-super-trainer` (amber), `--color-racing` (red)
- Gradient text: `text-gradient` utility class
- Glass effect: `glass` utility class
- Custom cursor: `data-cursor="view|drag|text|pointer|hover"` attribute

## Korean Localization

- `nameKo` / `labelKo` fields for Korean text
- `questionKo` for quiz questions
- `text-balance` / `text-pretty` for line-break control
- `word-break: keep-all` in body (globals.css)
- HTML lang="ko"

## Static Generation (SSG)

- All dynamic routes need `generateStaticParams()`
- `output: "export"` — no server-side rendering
- `unoptimized: true` for images
- `trailingSlash: true` for clean URLs
- Build validation: `npm run build` -> expect 20/20 pages

## Data Access Pattern

```
asics.json → shoe-utils.ts helpers → Component props → Render
```

No API routes, no database. Everything resolves at build time.
