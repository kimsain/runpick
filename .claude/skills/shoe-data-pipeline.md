---
name: shoe-data-pipeline
description: Use when adding, modifying, or reviewing shoe data in asics.json. Covers data schema, scoring rules, and cross-verification.
---

# Shoe Data Pipeline

## Data Schema

All shoe data lives in `src/data/brands/asics.json`. Each shoe object follows `RunningShoe` interface in `src/types/shoe.ts`.

Required fields:
```
id, brandId, name, nameKo, categoryId, subcategoryId,
price, priceFormatted, description, shortDescription,
imageUrl, specs, pros, cons, bestFor, technologies,
releaseYear, colorways, slug
```

Optional: `isUpcoming`, `upcomingNote`

## Category & Subcategory IDs

- **daily**: entry, max-cushion, stability, all-rounder, lightweight
- **super-trainer**: no-plate, light-plate, carbon-plate
- **racing**: half, full

Defined in `src/data/categories.ts`.

## Spec Scoring Rules (1-10 scale)

| Spec | Description | Anchor |
|------|-------------|--------|
| cushioning | 충격 흡수 | 10 = GEL-NIMBUS 급 |
| responsiveness | 에너지 리턴 | 10 = METASPEED RAY |
| stability | 착지 안정성 | 10 = GEL-KAYANO 급 |
| durability | 내구성 | Racing 2-4 정상, Daily 7-9 정상 |

- **Lab data (RunRepeat) > subjective reviews** always
- Sources priority: RunRepeat(Lab) > Doctors of Running > Believe in the Run > Road Trail Run > Supwell > Runner's World

## Checklist: Adding a New Shoe

1. Research specs from trusted sources (see priority above)
2. Add entry to `asics.json` following existing format exactly
3. Add shoe image as `public/shoes/{shoe-id}.webp` (WebP, square or 4:3)
4. Cross-verify description against official specs (MEGABLAST/SUPERBLAST 2 swap risk)
5. Run `npm run build` and verify page count increases by 1
6. Check `getAllShoes()` order if shoe should appear in FeaturedShoes

## Sorting Behavior

- `getAllShoes()`: No sort (preserves array order for FeaturedShoes)
- `getShoesByCategory()`, `getShoesByBrand()`, etc.: `b.name.localeCompare(a.name)` (name descending)

## Image Convention

- Path: `public/shoes/{shoe-id}.webp`
- imageUrl field: `/shoes/{shoe-id}.webp`
- Format: WebP, square or 4:3 ratio
