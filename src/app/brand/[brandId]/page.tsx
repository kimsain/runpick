import BrandPageClient from './BrandPageClient';

interface BrandPageProps {
  params: Promise<{ brandId: string }>;
}

export function generateStaticParams() {
  return [{ brandId: 'asics' }, { brandId: 'nike' }, { brandId: 'adidas' }];
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brandId } = await params;
  return <BrandPageClient brandId={brandId} />;
}
