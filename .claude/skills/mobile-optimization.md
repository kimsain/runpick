---
name: mobile-optimization
description: Use when adding animations, GSAP effects, or any new interactive component. Covers the mobile performance strategy with useIsDesktop guard and CSS override patterns.
---

# Mobile Optimization Strategy

Mobile (< 768px) uses CSS-first override approach. Desktop code stays 100% unchanged.

## Pattern 1: useIsDesktop() Guard

Every GSAP/Lenis useEffect MUST use this pattern:

```tsx
import { useIsDesktop } from '@/hooks/useIsDesktop';

const isDesktop = useIsDesktop();

useEffect(() => {
  if (!isDesktop) return;  // <-- MANDATORY guard
  gsap.registerPlugin(ScrollTrigger);
  // ... GSAP code ...
  return () => ctx.revert();
}, [isDesktop]);
```

Hook location: `src/hooks/useIsDesktop.ts` (one-shot check, no resize listener, SSR-safe).

Currently guarded (11 locations): CategoryNav, QuizCTA, Footer, ShoeDetailClient, ShoeSpecChart, SmoothScroll, BrandPageClient, ShoeCard, FeaturedShoes, ScrollProgress, PageTransition.

## Pattern 2: CSS-first GSAP Animation

Prevent render-to-init flash on desktop:

1. Declare initial state in `globals.css` `@media (min-width: 768px)` block:
```css
@media (min-width: 768px) {
  .my-element { opacity: 0; transform: translateY(40px); }
}
```

2. Use `gsap.to()` (NOT `gsap.fromTo()`):
```tsx
gsap.to('.my-element', { opacity: 1, y: 0, scrollTrigger: { ... } });
```

3. Add mobile override in `globals.css` `@media (max-width: 767px)` block:
```css
@media (max-width: 767px) {
  .my-element { opacity: 1 !important; transform: none !important; }
}
```

## Pattern 3: Decorative Elements

Hide decorative-only elements on mobile: `className="hidden md:block"`

Use ONLY for decoration (glow, shimmer). Never for content elements.

## Pattern 4: ShoeSpecChart Bars

Mobile: CSS variable `--target-scale` for direct display.
Desktop: GSAP animates `scaleX` via ScrollTrigger.

## Checklist: Adding New GSAP Animation

1. Add `useIsDesktop()` hook + `if (!isDesktop) return;` guard
2. Add CSS class to the animated element
3. Register desktop initial state in `globals.css` `@media (min-width: 768px)` block
4. Register mobile override in `globals.css` `@media (max-width: 767px)` block
5. Use `gsap.to()` pattern (not `fromTo`)
6. Verify: mobile shows content immediately, desktop animates on scroll

## Pattern 5: Mobile Flex Alignment

Cards with variable heights (e.g., 1-line vs 2-line description) misalign with `items-center`. Use breakpoint-split alignment:

```tsx
// ❌ items-center causes shorter cards to shift down
className="flex items-center gap-8"

// ✅ Top-align on mobile, center on desktop
className="flex items-start md:items-center gap-8"
```

When child elements extend above parent bounds (e.g., absolute-positioned badges at `-top-3`), add mobile-only top padding:

```tsx
className="flex items-start md:items-center pt-5 md:pt-0"
```

## Pattern 6: Single-Line Button Rows

When buttons overflow to a second line on narrow viewports:

1. Remove `flex-wrap`
2. Reduce mobile gap: `gap-1.5 sm:gap-4`
3. Reduce mobile padding: `px-3 py-1.5 sm:px-6 sm:py-3`
4. Scale text down: `text-sm sm:text-base`, `text-xs sm:text-sm`
5. Scale margins: `mr-1 sm:mr-2`, `ml-1 sm:ml-2`

Test at 375px (iPhone SE) — the narrowest common viewport.

## Framer Motion on Mobile

`whileInView` works with native scroll — safe to keep on mobile.
`animate` (entrance) also works fine.
No Framer Motion guards needed.
