---
name: performance-patterns
description: Use when optimizing page load speed, runtime performance, or bundle size. Covers font loading, code splitting, scroll handlers, timer cleanup, and texture caching patterns.
---

# Performance Patterns

## Font Loading

External fonts (Pretendard, Google Fonts) block rendering. Add preconnect hints before stylesheet links:

```tsx
// layout.tsx <head>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

// Then the stylesheet (no contradictory as="style" on rel="stylesheet")
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
  crossOrigin="anonymous"
/>
```

Impact: DNS + connection 100-200ms savings.

## Code Splitting: Desktop-Only Components

Components that return `null` on mobile should be dynamically imported:

```tsx
import dynamic from 'next/dynamic';

const GrainOverlay = dynamic(() => import('@/components/effects/GrainOverlay'), { ssr: false });
const ScrollProgress = dynamic(() => import('@/components/effects/ScrollProgress'), { ssr: false });
const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false });
```

**Constraint:** Never dynamic-import components that are direct children of `AnimatePresence` — breaks exit animations. Keep `SmoothScroll` and `PageTransition` as static imports.

Impact: ~15-20KB gzipped reduction on mobile bundle.

## Scroll Handler Optimization

Scroll events fire 60+ times per second. Avoid `setState` on every event — use ref-based comparison:

```tsx
const lastScrollY = useRef(0);
const scrolledRef = useRef(false);
const directionRef = useRef<'up' | 'down'>('up');

useEffect(() => {
  const handleScroll = () => {
    const currentY = window.scrollY;
    const newDirection = currentY > lastScrollY.current ? 'down' : 'up';
    const newScrolled = currentY > 20;
    lastScrollY.current = currentY;

    // Only call setState when value actually changes
    if (newDirection !== directionRef.current) {
      directionRef.current = newDirection;
      setScrollDirection(newDirection);
    }
    if (newScrolled !== scrolledRef.current) {
      scrolledRef.current = newScrolled;
      setScrolled(newScrolled);
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

Applied in: Header.tsx, BrandPageClient.tsx, CategoryPageClient.tsx.

Impact: ~90% fewer re-renders during scroll.

## Timer Cleanup

`setTimeout` chains (e.g., quiz auto-advance) leak if component unmounts mid-sequence:

```tsx
const timersRef = useRef<NodeJS.Timeout[]>([]);

// Track each timer
timersRef.current.push(setTimeout(() => setStep(1), 300));
timersRef.current.push(setTimeout(() => setStep(2), 600));

// Cleanup on unmount
useEffect(() => {
  return () => {
    timersRef.current.forEach(t => clearTimeout(t));
  };
}, []);
```

Applied in: quiz/page.tsx, QuizQuestion.tsx.

## Canvas Texture Caching

GrainOverlay generates a noise texture via Canvas API. Cache at module level to avoid re-generation on every navigation:

```tsx
let cachedGrainUrl: string | null = null;

function getGrainTexture(): string {
  if (cachedGrainUrl) return cachedGrainUrl;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  // ... generate noise ...
  cachedGrainUrl = canvas.toDataURL('image/png');
  return cachedGrainUrl;
}
```

One-shot mobile check replaces resize listener (same pattern as `useIsDesktop`).

Impact: ~5-10ms savings per navigation.

## What NOT to Optimize

| Item | Reason |
|------|--------|
| Image optimization (next/image) | Static export requires `unoptimized: true` |
| React.memo for ShoeCard | React 19 compiler handles this automatically |
| Framer Motion/GSAP bundle splitting | Structural change, marginal benefit |
| Inline style useMemo | Negligible in React 19, reduces readability |
| swcMinify | Already default in Next.js 16 |
