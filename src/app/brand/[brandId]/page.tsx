import BrandPageClient from './BrandPageClient';
import { getAllBrandIds } from '@/utils/shoe-utils';

interface BrandPageProps {
  params: Promise<{ brandId: string }>;
}

export function generateStaticParams() {
  return getAllBrandIds().map((brandId) => ({ brandId }));
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brandId } = await params;
  return <BrandPageClient brandId={brandId} />;
}
