<p align="center">
  <img src="public/runpick-og.png" alt="RunPick" width="600" />
</p>

<h1 align="center">RunPick</h1>

<p align="center">
  <strong>ASICS 러닝화 추천 플랫폼</strong><br/>
  5가지 질문으로 나에게 딱 맞는 러닝화를 찾아보세요
</p>

<p align="center">
  <a href="#features">Features</a> &middot;
  <a href="#tech-stack">Tech Stack</a> &middot;
  <a href="#getting-started">Getting Started</a> &middot;
  <a href="#architecture">Architecture</a> &middot;
  <a href="#project-structure">Project Structure</a>
</p>

---

## Features

**Interactive Quiz Recommendation**
- 5-question quiz with auto-advance (0.5s after selection)
- Spec-based matching algorithm using real product data (cushioning, responsiveness, stability, weight)
- Match score visualization with animated circular progress
- Top recommendation + 3 alternatives with comparison reasons

**Premium Catalog**
- 12 ASICS running shoes across 3 categories (Daily / Super Trainer / Racing)
- Detailed spec charts, pros & cons, and technology breakdowns
- Category and subcategory browsing with filtering

**Visual Effects**
- Framer Motion page transitions and micro-interactions
- GSAP ScrollTrigger scroll-based animations
- Lenis smooth scrolling
- Custom cursor, magnetic elements, text reveal, floating shapes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Static Export) |
| Language | [TypeScript 5.7](https://www.typescriptlang.org/) |
| UI | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) |
| Scroll | [Lenis](https://lenis.darkroom.engineering/) |
| Deployment | Static Export (`output: "export"`) |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (Turbopack)
npm run dev

# Build static export
npm run build

# Serve production build
npm run start

# Lint
npm run lint
```

The dev server starts at `http://localhost:3000`.

## Architecture

### Data Flow

All product data is statically defined in JSON. No database, no API routes — the entire site is pre-rendered at build time.

```
asics.json → shoe-utils.ts → Components → Static HTML (20 pages)
```

### Quiz System

```
quiz-questions.ts    →  QuizQuestion (5 questions, auto-advance)
                          ↓
quiz-logic.ts        →  Spec-based scoring algorithm
                          ├─ 40% Attribute match (cushioning, responsiveness, stability, weight)
                          ├─ 40% Category match (daily, super-trainer, racing)
                          └─ 20% Experience bonus (carbon plate adjustment)
                          ↓
QuizResult.tsx       →  Match score (60-98%) + reasons + 3 alternatives
```

### Rendering Strategy

| Route | Strategy |
|-------|----------|
| `/` | Static (SSG) |
| `/quiz` | Client-side (full interactivity) |
| `/brand/asics` | SSG with `generateStaticParams` |
| `/brand/asics/[category]` | SSG (daily, super-trainer, racing) |
| `/shoe/[shoeId]` | SSG (12 shoe detail pages) |

### Server / Client Split

- **Server Components**: `layout.tsx` (metadata, fonts)
- **Client Wrapper**: `LayoutClient.tsx` (smooth scroll, page transitions, custom cursor)
- **Client Pages**: Quiz (full interactivity), all animation-heavy components

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Server Component)
│   ├── page.tsx                  # Home — hero + category navigation
│   ├── quiz/page.tsx             # Quiz — 5-step interactive flow
│   ├── brand/[brandId]/          # Brand catalog + category views
│   └── shoe/[shoeId]/            # Shoe detail pages
├── components/
│   ├── common/                   # Button, Badge, shared UI
│   ├── effects/                  # FloatingShapes, TextReveal, MagneticElement,
│   │                             #   ImageDistortion, GrainOverlay, ScrollProgress
│   ├── hero/                     # HeroSection
│   ├── layout/                   # Header, Footer, LayoutClient
│   ├── quiz/                     # QuizQuestion, QuizProgress, QuizResult
│   └── shoe/                     # ShoeCard, ShoeSpecChart, ShoeDetail
├── data/
│   ├── brands/asics.json         # All shoe data (specs, pros/cons, technologies)
│   ├── categories.ts             # Category/subcategory definitions
│   └── quiz-questions.ts         # 5 quiz questions with scoring weights
├── types/
│   ├── shoe.ts                   # RunningShoe, ShoeSpecs, Category interfaces
│   └── quiz.ts                   # QuizResult, QuizAnswer, ScoringCategory
├── utils/
│   ├── shoe-utils.ts             # Data access helpers
│   └── quiz-logic.ts             # Matching algorithm (spec-based scoring)
├── constants/
│   └── animation.ts              # Shared animation constants
└── public/
    └── shoes/                    # Product images (WebP)
```

## Shoe Catalog

### Daily
| Model | Weight | Cushioning | Key Feature |
|-------|--------|------------|-------------|
| GEL-NIMBUS 28 | 283g | 9/10 | Max cushioning daily trainer |
| GEL-KAYANO 32 | 300g | 7/10 | Stability with 10/10 support |
| GLIDERIDE MAX 2 | 261g | 8/10 | Rocker geometry for efficiency |
| NOVABLAST 5 | 255g | 8/10 | Bouncy all-rounder |

### Super Trainer
| Model | Weight | Responsiveness | Key Feature |
|-------|--------|---------------|-------------|
| SUPERBLAST 2 | 252g | 7/10 | Versatile super trainer |
| MEGABLAST | 230g | 9/10 | High-rebound training |
| SONICBLAST | 255g | 8/10 | Speed-focused training |
| MAGIC SPEED 5 | 193g | 8/10 | Lightweight plated trainer |

### Racing
| Model | Weight | Responsiveness | Key Feature |
|-------|--------|---------------|-------------|
| METASPEED RAY | 129g | 10/10 | Ultra-light 5K-10K racer |
| METASPEED SKY TOKYO | 170g | 9/10 | Marathon carbon plate |
| METASPEED EDGE TOKYO | 170g | 9/10 | Forefoot-strike carbon plate |
| S4+ YOGIRI | 229g | 7/10 | Stability-focused racer |

## License

This project is for personal/educational use. ASICS product data and images are property of ASICS Corporation.
