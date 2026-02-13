// Data access helpers for all brand JSON files.
// getAllShoes() preserves array order (for FeaturedShoes manual ordering).
// Listing functions (getShoesByCategory, etc.) sort by b.name.localeCompare(a.name).

import { RunningShoe, Brand, CategoryId, SubcategoryId } from '@/types/shoe';
import asicsData from '@/data/brands/asics.json';
import nikeData from '@/data/brands/nike.json';
import adidasData from '@/data/brands/adidas.json';

const allBrandData = [asicsData, nikeData, adidasData] as const;
const compareByNameDesc = (a: RunningShoe, b: RunningShoe) => b.name.localeCompare(a.name);

const ALL_SHOES = Object.freeze(
  allBrandData.flatMap((brand) => brand.shoes as RunningShoe[])
) as readonly RunningShoe[];

const ALL_BRANDS = Object.freeze(allBrandData.map((brand) => brand.brand as Brand)) as readonly Brand[];
const ALL_BRAND_IDS = Object.freeze(ALL_BRANDS.map((brand) => brand.id)) as readonly string[];

const BRAND_BY_ID = new Map(ALL_BRANDS.map((brand) => [brand.id, brand] as const));
const SHOE_BY_ID = new Map(ALL_SHOES.map((shoe) => [shoe.id, shoe] as const));
const SHOE_BY_SLUG = new Map(ALL_SHOES.map((shoe) => [shoe.slug, shoe] as const));

function buildShoeIndex<K extends string>(
  getKey: (shoe: RunningShoe) => K
): Map<K, readonly RunningShoe[]> {
  const index = new Map<K, RunningShoe[]>();

  for (const shoe of ALL_SHOES) {
    const key = getKey(shoe);
    const bucket = index.get(key);
    if (bucket) {
      bucket.push(shoe);
    } else {
      index.set(key, [shoe]);
    }
  }

  for (const [key, shoes] of index.entries()) {
    index.set(key, [...shoes].sort(compareByNameDesc));
  }

  return index as Map<K, readonly RunningShoe[]>;
}

const SHOES_BY_CATEGORY = buildShoeIndex((shoe) => shoe.categoryId as CategoryId);
const SHOES_BY_SUBCATEGORY = buildShoeIndex((shoe) => shoe.subcategoryId as SubcategoryId);
const SHOES_BY_BRAND = buildShoeIndex((shoe) => shoe.brandId);
const SHOES_BY_BRAND_AND_CATEGORY = buildShoeIndex(
  (shoe) => `${shoe.brandId}::${shoe.categoryId}`
);

function copyShoes(shoes: readonly RunningShoe[] | undefined): RunningShoe[] {
  return shoes ? [...shoes] : [];
}

export function getAllShoes(): RunningShoe[] {
  return [...ALL_SHOES];
}

export function getAllBrands(): Brand[] {
  return [...ALL_BRANDS];
}

export function getAllBrandIds(): string[] {
  return [...ALL_BRAND_IDS];
}

export function getBrandById(brandId: string): Brand | undefined {
  return BRAND_BY_ID.get(brandId);
}

export function getShoeById(id: string): RunningShoe | undefined {
  return SHOE_BY_ID.get(id);
}

export function getShoeBySlug(slug: string): RunningShoe | undefined {
  return SHOE_BY_SLUG.get(slug);
}

export function getShoesByCategory(categoryId: CategoryId): RunningShoe[] {
  return copyShoes(SHOES_BY_CATEGORY.get(categoryId));
}

export function getShoesBySubcategory(subcategoryId: SubcategoryId): RunningShoe[] {
  return copyShoes(SHOES_BY_SUBCATEGORY.get(subcategoryId));
}

export function getShoesByBrand(brandId: string): RunningShoe[] {
  return copyShoes(SHOES_BY_BRAND.get(brandId));
}

export function getShoesByBrandAndCategory(brandId: string, categoryId: CategoryId): RunningShoe[] {
  return copyShoes(SHOES_BY_BRAND_AND_CATEGORY.get(`${brandId}::${categoryId}`));
}

interface SimilarShoesOptions {
  sameBrandFirst?: boolean;
}

export function getSimilarShoes(
  shoe: RunningShoe,
  limit: number = 3,
  options: SimilarShoesOptions = {}
): RunningShoe[] {
  const { sameBrandFirst = false } = options;

  const baseMatches = ALL_SHOES.filter(
    (s) =>
      s.id !== shoe.id &&
      (s.subcategoryId === shoe.subcategoryId || s.categoryId === shoe.categoryId)
  );

  if (!sameBrandFirst) {
    return baseMatches.slice(0, limit);
  }

  const sameBrand = baseMatches.filter((s) => s.brandId === shoe.brandId);
  const crossBrand = baseMatches.filter((s) => s.brandId !== shoe.brandId);

  return [...sameBrand, ...crossBrand].slice(0, limit);
}

const KRW_FORMATTER = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
});

export function formatPrice(price: number): string {
  return KRW_FORMATTER.format(price);
}

export function getSpecPercentage(value: number, max: number = 10): number {
  return (value / max) * 100;
}

export function getWeightCategory(weight: number): string {
  if (weight < 220) return '초경량';
  if (weight < 250) return '경량';
  if (weight < 280) return '보통';
  return '무거운 편';
}

export function getCategoryColor(categoryId: CategoryId): string {
  const colors: Record<CategoryId, string> = {
    daily: 'var(--color-daily)',
    'super-trainer': 'var(--color-super-trainer)',
    racing: 'var(--color-racing)',
  };
  return colors[categoryId];
}
