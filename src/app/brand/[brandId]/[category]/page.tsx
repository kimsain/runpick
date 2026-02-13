import { categories } from '@/data/categories';
import CategoryPageClient from './CategoryPageClient';

interface CategoryPageProps {
  params: Promise<{ brandId: string; category: string }>;
}

export function generateStaticParams() {
  const brandIds = ['asics', 'nike', 'adidas'];
  return brandIds.flatMap((brandId) =>
    categories.map((category) => ({
      brandId,
      category: category.id,
    }))
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { brandId, category } = await params;
  return <CategoryPageClient brandId={brandId} category={category} />;
}
