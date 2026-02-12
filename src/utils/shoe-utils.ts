import { RunningShoe, CategoryId, SubcategoryId } from '@/types/shoe';
import asicsData from '@/data/brands/asics.json';

export function getAllShoes(): RunningShoe[] {
  return asicsData.shoes as RunningShoe[];
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

export function getSimilarShoes(shoe: RunningShoe, limit: number = 3): RunningShoe[] {
  return getAllShoes()
    .filter(
      (s) =>
        s.id !== shoe.id &&
        (s.subcategoryId === shoe.subcategoryId || s.categoryId === shoe.categoryId)
    )
    .slice(0, limit);
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
