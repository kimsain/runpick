// Category & subcategory definitions with colors and icons.
// 3 categories (daily, super-trainer, racing), 10 subcategories.
// Colors use CSS custom properties: var(--color-daily), etc.

import { Category, Subcategory, CategoryId } from '@/types/shoe';

export const subcategories: Subcategory[] = [
  // Daily
  {
    id: 'entry',
    name: 'Entry',
    nameKo: '입문용',
    description: '러닝을 시작하는 분들을 위한 편안하고 안정적인 선택',
    categoryId: 'daily',
  },
  {
    id: 'max-cushion',
    name: 'Max Cushion',
    nameKo: '맥스 쿠션',
    description: '장거리 러닝에 최적화된 푹신한 쿠셔닝',
    categoryId: 'daily',
  },
  {
    id: 'stability',
    name: 'Stability',
    nameKo: '안정성',
    description: '과회내 방지 및 안정적인 착지를 돕는 러닝화',
    categoryId: 'daily',
  },
  {
    id: 'all-rounder',
    name: 'All-Rounder',
    nameKo: '올라운더',
    description: '다양한 러닝에 활용할 수 있는 만능 러닝화',
    categoryId: 'daily',
  },
  {
    id: 'lightweight',
    name: 'Lightweight',
    nameKo: '경량',
    description: '가볍고 빠른 템포런에 적합한 러닝화',
    categoryId: 'daily',
  },
  // Super Trainer
  {
    id: 'no-plate',
    name: 'No Plate',
    nameKo: '노 플레이트',
    description: '플레이트 없이 뛰어난 반발력을 제공하는 슈퍼 트레이너',
    categoryId: 'super-trainer',
  },
  {
    id: 'light-plate',
    name: 'Light Plate',
    nameKo: '라이트 플레이트',
    description: '가벼운 플레이트로 추진력을 높인 슈퍼 트레이너',
    categoryId: 'super-trainer',
  },
  {
    id: 'carbon-plate',
    name: 'Carbon Plate',
    nameKo: '카본 플레이트',
    description: '카본 플레이트로 레이싱에 가까운 반발력을 제공',
    categoryId: 'super-trainer',
  },
  // Racing
  {
    id: 'half',
    name: 'Half Marathon',
    nameKo: '하프',
    description: '하프마라톤 및 10K 레이스에 최적화된 경량 레이서',
    categoryId: 'racing',
  },
  {
    id: 'full',
    name: 'Full Marathon',
    nameKo: '풀',
    description: '풀마라톤을 위한 최고의 퍼포먼스 레이싱화',
    categoryId: 'racing',
  },
];

export const categories: Category[] = [
  {
    id: 'daily',
    name: 'Daily',
    nameKo: '데일리',
    description: '매일 신을 수 있는 편안하고 내구성 좋은 트레이닝화',
    color: 'var(--color-daily)',
    icon: '🏃',
    subcategories: subcategories.filter((s) => s.categoryId === 'daily'),
  },
  {
    id: 'super-trainer',
    name: 'Super Trainer',
    nameKo: '슈퍼 트레이너',
    description: '데일리와 레이싱의 중간, 빠른 템포런과 인터벌에 최적화',
    color: 'var(--color-super-trainer)',
    icon: '⚡',
    subcategories: subcategories.filter((s) => s.categoryId === 'super-trainer'),
  },
  {
    id: 'racing',
    name: 'Racing',
    nameKo: '레이싱',
    description: '대회를 위한 최고 성능의 경량 레이싱화',
    color: 'var(--color-racing)',
    icon: '🏆',
    subcategories: subcategories.filter((s) => s.categoryId === 'racing'),
  },
];

export function getCategoryById(id: CategoryId): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getSubcategoryById(id: string): Subcategory | undefined {
  return subcategories.find((s) => s.id === id);
}

export function getSubcategoriesByCategory(categoryId: CategoryId): Subcategory[] {
  return subcategories.filter((s) => s.categoryId === categoryId);
}
