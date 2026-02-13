---
name: animation-patterns
description: Use when adding or modifying animations. Covers GSAP ScrollTrigger, Framer Motion, and Lenis smooth scroll conventions.
---

# Animation Patterns

## Animation Stack

| Library | Role | Scope |
|---------|------|-------|
| GSAP + ScrollTrigger | Scroll-driven animations (pin, scrub, reveal) | Desktop only (useIsDesktop guard) |
| Framer Motion | Component-level animations (hover, tap, entrance, whileInView) | All viewports |
| Lenis | Smooth scrolling + GSAP ticker sync | Desktop only (useIsDesktop guard) |
| CSS @keyframes | Infinite loops (ScrollIndicator bounce) | All viewports |

## Shared Constants (`src/constants/animation.ts`)

```
Easing:  EASE_OUT_EXPO, EASE_OUT_CUBIC, EASE_IN_OUT_QUART
Springs: SPRING_SNAPPY (400/25), SPRING_BOUNCY (300/15), SPRING_SMOOTH (200/30)
Duration: DUR_FAST (0.3), DUR_NORMAL (0.5), DUR_SLOW (0.8), DUR_REVEAL (1.0)
Stagger:  STAGGER_FAST (0.03), STAGGER_NORMAL (0.08), STAGGER_SLOW (0.15)
Breakpoint: MOBILE_BREAKPOINT (768)
```

Always import from `@/constants/animation` instead of hardcoding values.

## GSAP Conventions

- Always `gsap.registerPlugin(ScrollTrigger)` inside useEffect
- Always wrap in `gsap.context(() => { ... }, scopeRef)` for cleanup
- Use `gsap.to()` with CSS initial state (see mobile-optimization skill)
- `toggleActions: 'play none none none'` for one-shot reveals
- `scrub: 1` for scroll-linked animations (FeaturedShoes horizontal scroll)
- Cleanup: `return () => ctx.revert()` or manual `trigger.kill()`

## Framer Motion Conventions

- Entrance: `initial` + `whileInView` with `viewport={{ once: true }}`
- Hover: `whileHover` (not onMouseEnter state)
- Stagger: use delay offset `delay: index * STAGGER_NORMAL`
- Springs for interactive: `type: 'spring'` with SPRING_SNAPPY
- Easing cast: `ease: EASE_OUT_EXPO as unknown as number[]` (Framer type quirk)

## Lenis + GSAP Sync (`SmoothScroll.tsx`)

```
Lenis.on('scroll', ScrollTrigger.update)  // sync scroll position
gsap.ticker.add(time => lenis.raf(time * 1000))  // frame-perfect sync
gsap.ticker.lagSmoothing(0)  // disable lag compensation
```

## Known Constraints

- 3D transform: `rotateX`/`rotateY` max 6deg (text blur above)
- Hero background: static only (parallax causes flickering)
- Infinite animation: use CSS @keyframes, not Framer Motion `repeat: Infinity`
- FeaturedShoes pin: requires 1024px+ (not 768px — cards too narrow)
