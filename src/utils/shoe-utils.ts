// Data access helpers for all brand JSON files.
// getAllShoes() preserves array order (for FeaturedShoes manual ordering).
// Listing functions (getShoesByCategory, etc.) sort by b.name.localeCompare(a.name).

import { RunningShoe, Brand, CategoryId, SubcategoryId } from '@/types/shoe';
import asicsData from '@/data/brands/asics.json';
import nikeData from '@/data/brands/nike.json';
import adidasData from '@/data/brands/adidas.json';

const allBrandData = [asicsData, nikeData, adidasData];

export function getAllShoes(): RunningShoe[] {
  return allBrandData.flatMap((brand) => brand.shoes) as RunningShoe[];
}

export function getAllBrands(): Brand[] {
  return allBrandData.map((b) => b.brand) as Brand[];
}

export function getAllBrandIds(): string[] {
  return allBrandData.map((b) => b.brand.id);
}

export function getBrandById(brandId: string): Brand | undefined {
  return allBrandData.find((b) => b.brand.id === brandId)?.brand as Brand | undefined;
}

export function getShoeById(id: string): RunningShoe | undefined {
  return getAllShoes().find((shoe) => shoe.id === id);
}

export function getShoeBySlug(slug: string): RunningShoe | undefined {
  return getAllShoes().find((shoe) => shoe.slug === slug);
}

export function getShoesByCategory(categoryId: CategoryId): RunningShoe[] {
  return getAllShoes()
    .filter((shoe) => shoe.categoryId === categoryId)
    .sort((a, b) => b.name.localeCompare(a.name));
}

export function getShoesBySubcategory(subcategoryId: SubcategoryId): RunningShoe[] {
  return getAllShoes()
    .filter((shoe) => shoe.subcategoryId === subcategoryId)
    .sort((a, b) => b.name.localeCompare(a.name));
}

export function getShoesByBrand(brandId: string): RunningShoe[] {
  return getAllShoes()
    .filter((shoe) => shoe.brandId === brandId)
    .sort((a, b) => b.name.localeCompare(a.name));
}

export function getShoesByBrandAndCategory(brandId: string, categoryId: CategoryId): RunningShoe[] {
  return getAllShoes()
    .filter((shoe) => shoe.brandId === brandId && shoe.categoryId === categoryId)
    .sort((a, b) => b.name.localeCompare(a.name));
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

  const baseMatches = getAllShoes().filter(
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

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);
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
