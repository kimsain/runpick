import { categories } from '@/data/categories';
import CategoryPageClient from './CategoryPageClient';

interface CategoryPageProps {
  params: Promise<{ brandId: string; category: string }>;
}

export function generateStaticParams() {
  return categories.map((category) => ({
    brandId: 'asics',
    category: category.id,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { brandId, category } = await params;
  return <CategoryPageClient brandId={brandId} category={category} />;
}
