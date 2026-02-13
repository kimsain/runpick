# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RunPick is a Korean-language running shoe recommendation platform for ASICS. It's a static-generated Next.js 16 app with premium animations, smooth scrolling UX, and a quiz-based recommendation system.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Build static export to /out (expect 20/20 pages)
npm run start    # Serve built static files
npm run lint     # Run ESLint
```

## Tech Stack

- **Next.js 16** (App Router, SSG with `output: "export"`)
- **React 19** with TypeScript 5.7
- **Tailwind CSS 4** with custom CSS properties
- **Framer Motion** for component animations
- **GSAP ScrollTrigger** for scroll-based animations
- **Lenis** for smooth scrolling (desktop only — `useIsDesktop()` hook guard)

## Architecture

### Data Flow

All product data lives in `src/data/brands/asics.json`. No database or API routes—everything is statically generated.

```
asics.json → shoe-utils.ts → Components → Static HTML
```

Quiz flow (5 questions, single-select, auto-advance 0.5s after click):
```
quiz-questions.ts → QuizQuestion (auto-advance) → quiz-logic.ts (spec-based scoring) → QuizResult
```

Quiz matching algorithm (no manual shoeTraits — uses asics.json specs directly):
- 40% Attribute match: cushioning, responsiveness, stability from `shoe.specs`; lightweight = `(350 - weight) / 350`
- 40% Category match: user preference vs `shoe.categoryId` (daily / super-trainer / racing)
- 20% Experience bonus: carbon racing shoes get bonus/penalty based on user's racing preference
- Match score clamped to 60-98%, displayed as animated circular progress

### Server/Client Split

- `layout.tsx` - Server Component (metadata, fonts)
- `LayoutClient.tsx` - Client wrapper for animations, smooth scroll, custom cursor
- Pages use `generateStaticParams()` for SSG pre-rendering
- Quiz page is full client component

### Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Hero + category navigation |
| `/quiz` | Interactive recommendation quiz |
| `/brand/asics` | Brand catalog overview |
| `/brand/asics/[category]` | Category view (daily/super-trainer/racing) |
| `/shoe/[shoeId]` | Shoe detail page |

## Key Files

- `src/data/brands/asics.json` - All shoe data (specs, pros/cons, technologies)
- `src/data/categories.ts` - Category/subcategory definitions with colors
- `src/utils/shoe-utils.ts` - Data access helpers (getShoeBySlug, getSimilarShoes, etc.)
- `src/utils/quiz-logic.ts` - Quiz scoring algorithm (spec-based, no manual shoeTraits)
- `src/types/shoe.ts` - RunningShoe, Category, ShoeSpecs interfaces
- `src/types/quiz.ts` - QuizResult (matchScore, matchReasons, alternatives with reasons), QuizAnswer (single-select)
- `src/data/quiz-questions.ts` - 5 quiz questions with scoring weights per option
- `src/components/layout/LayoutClient.tsx` - Client wrappers (GrainOverlay, ScrollProgress, CustomCursor, SmoothScroll, PageTransition)
- `src/constants/animation.ts` - Shared animation constants (easing, springs, `MOBILE_BREAKPOINT`)
- `src/hooks/useIsDesktop.ts` - One-shot desktop check hook for GSAP guards (SSR-safe, no resize)
- `src/app/globals.css` - Desktop GSAP 초기 상태 블록 + ScrollIndicator CSS keyframes + 모바일 `!important` 오버라이드

## Conventions

- Client components use `*Client.tsx` suffix
- Korean translations use `nameKo`/`labelKo` fields
- Shoes have `slug` field for URL-friendly paths
- Images stored in `public/shoes/` as webp
- CSS uses `var(--color-*)` custom properties for theming
- ASICS brand colors: blue `#003DA5`, accent cyan `#00D1FF`

## Shoe Spec Scoring

- 4 specs: cushioning, responsiveness, stability, durability (1-10 scale)
- 10 = absolute best in category (e.g., responsiveness 10 = METASPEED RAY)
- Prefer lab data (RunRepeat) over subjective reviews
- Racing durability 2-4 = normal, Daily durability 7-9 = normal

## Mobile Performance Strategy

모바일(< 768px)은 CSS-first 오버라이드 방식으로 최적화. 데스크탑 코드는 100% 동일 유지.

- **`useIsDesktop()` 훅**: 모든 GSAP/Lenis 가드에 표준화된 `useIsDesktop()` 훅 사용. `if (!isDesktop) return;` 패턴. (13곳: CategoryNav, QuizCTA, Footer, ShoeDetailClient, ShoeSpecChart, SmoothScroll, BrandPageClient, ShoeCard, FeaturedShoes, ScrollProgress, PageTransition, Header, CategoryPageClient)
- **CSS `!important` 오버라이드**: `globals.css` 끝 `@media (max-width: 767px)` 블록이 GSAP inline style(`opacity:0`, `transform`)을 강제 해제
- **장식 요소**: `hidden md:block`으로 모바일에서 숨김 (glow, shimmer 등)
- **ShoeSpecChart 바**: 모바일에서는 CSS 변수 `--target-scale`로 직접 표시, 데스크탑에서는 GSAP 애니메이션
- **Framer Motion `whileInView`**: 네이티브 스크롤에서 안정적이므로 모바일에서도 유지
- **ShoeCard 장식**: `ShoeCardDecorations` 서브컴포넌트로 분리

## Gotchas

- **Description swap risk**: MEGABLAST/SUPERBLAST 2 descriptions were once swapped — always cross-verify shoe descriptions against official specs
- **3D CSS transforms**: `rotateX`/`rotateY` above 6deg causes text blur — keep under 6deg
- **Hero parallax**: Background parallax causes flickering — keep hero backgrounds static
- **Linter + asics.json**: ESLint may auto-fix some Korean expressions in asics.json — accept if meaning is preserved
- **`getAllShoes()` order**: Returns unmodified array order (not sorted) to preserve FeaturedShoes manual ordering
- **Listing functions**: `getShoesByCategory()` etc. sort by `b.name.localeCompare(a.name)` (name descending)
- **GSAP CSS-first 패턴**: `gsap.fromTo()` 대신 CSS로 초기 상태 선언(`globals.css` `@media (min-width: 768px)` 블록) + `gsap.to()`로 최종 상태 애니메이션. 렌더~init 플래시 방지
- **Mobile GSAP 추가 시**: 새 GSAP useEffect에는 반드시 `useIsDesktop()` 훅 + `if (!isDesktop) return;` 가드 추가, 대응 CSS 클래스를 `globals.css` 모바일 블록에 등록. 데스크탑 초기 상태도 `@media (min-width: 768px)` 블록에 등록하고 `gsap.to()` 사용
- **`hidden md:block` 주의**: 모바일에서 숨길 장식 요소에만 사용. 콘텐츠 요소에 실수로 적용하면 모바일에서 사라짐
- **SmoothScroll `key={pathname}` 금지**: React tree 전체 파괴 → 진행 중인 모든 Framer Motion 애니메이션 크래시 (`TypeError: Cannot read properties of null`). 대신 `lenis.scrollTo(0, { immediate: true })` 사용
- **PageTransition은 opacity만**: clipPath 애니메이션은 AnimatePresence exit 시 detached DOM에서 interpolation 에러 발생
- **`next/dynamic` + AnimatePresence 자식 금지**: AnimatePresence 직계 자식을 dynamic import하면 exit 애니메이션이 깨짐. SmoothScroll, PageTransition은 반드시 static import
- **스크롤 핸들러 ref-guard 필수**: `setState`를 매 scroll event마다 호출하지 말 것. ref로 이전 값 비교 후 변경 시에만 setState 호출 (Header, BrandPageClient, CategoryPageClient에 적용됨)

## Static Export Notes

- `next.config.ts` has `output: "export"` and `trailingSlash: true`
- Images use `unoptimized: true` (no Next.js image optimization)
- All routes must have `generateStaticParams()` for dynamic segments

## Testing

- No test framework configured (no jest/vitest). Build verification (`npm run build` → 20/20 pages) is the primary validation method.
